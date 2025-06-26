using Iced.Intel;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Reflection.Emit;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CactbotSelf
{
    public class RelativeJump
    {
        public ulong Destination;
        public ulong Source;
    }
    internal unsafe partial class Offsets
    {
        public ulong NetworkAdress = 0;
        public List<RelativeJump> CallFunctions = new();
        public List<TableInfo> tableInfos=new();
        public static int MapeffectOpcode { get; set; }
		public static int MapeffectOpcode4 { get; set; }
		public static int MapeffectOpcode8 { get; set; }
		public static int MapeffectOpcode12 { get; set; }
		public static int ObjectOpcode { get; set; }
        public void findNetDown()
        {
            //40 55 56 57 48 8D 6C 24 ? 48 81 EC ? ? ? ? 48 8B 05 ? ? ? ? 48 33 C4 48 89 45 37 8B FA
            //40 55 56 57 48 8D 6C 24 ?? 48 81 EC ?? ?? ?? ?? 48 8B 05 ?? ?? ?? ?? 48 33 C4 48 89 45 ?? 8B ?? 49 8B ??
            var netDown = FindPattern("48 8D 40 20 83 F9 20 72 95 41 8B D7");
            if (netDown .Count>=1) 
            {
                NetworkAdress = netDown[0];
            }
            else
            {
                NetworkAdress = FindPattern("40 53 56 48 81 EC ?? ?? ?? ?? 48 8B 05 ?? ?? ?? ?? 48 33 C4 48 89 44 24 ?? 8B F2")[0];
            }
            var bytes = ReadBytes(NetworkAdress, 400);
            var codeReader = new ByteArrayCodeReader(bytes);
            var decoder = Decoder.Create(64, codeReader);
            decoder.IP = NetworkAdress;
            ProcessJumpTable(codeReader, decoder, ref tableInfos);
            var mapEffectAdress = FindPattern("40 53 48 83 EC 20 48 8B D9 E8 ? ? ? ? 48 8B C8 48 8B D3 48 83 C4 20 5B E9 ? ? ? ? CC CC CC CC CC CC CC CC CC CC CC CC CC CC CC CC CC CC 40 53 48 83 EC 20 48 8B D9 E8 ? ? ? ? 48 8B C8 E8 ? ? ? ? 48 85 C0 74 10");
			var mapEffectAdress4 = FindPattern("E8 ? ? ? ? E9 ? ? ? ? 4C 8D 46 10 8B D7 48 8D 0D ? ? ? ? E8 ? ? ? ? 48 8D 4E 10 E8 ? ? ? ? E9 ? ? ? ? 4C 8D 46 10 8B D7 48 8D 0D ? ? ? ? E8 ? ? ? ? 48 8D 4E 10 E8 ? ? ? ? E9 ? ? ? ? 48 8D 4E 10 BA 0A 00 00 00");
			var mapEffectAdress8 = FindPattern("E8 ? ? ? ? E9 ? ? ? ? 4C 8D 46 10 8B D7 48 8D 0D ? ? ? ? E8 ? ? ? ? 48 8D 4E 10 E8 ? ? ? ? E9 ? ? ? ? 48 8D 4E 10 BA 0A 00 00 00");
			var mapEffectAdress12 = FindPattern("E8 ? ? ? ? E9 ? ? ? ? 48 8D 4E 10 BA 0A 00 00 00");
			var ObejectAdress = FindPattern("48 89 5C 24 ? 57 48 83 EC 50 F6 42 02 02");
            MapeffectOpcode = FindOpcode(mapEffectAdress);
			MapeffectOpcode4= FindOpcode(mapEffectAdress4,false);
			MapeffectOpcode8 = FindOpcode(mapEffectAdress8, false);
			MapeffectOpcode12 = FindOpcode(mapEffectAdress12, false);
			ObjectOpcode = FindOpcode(ObejectAdress);
        }
        public int FindOpcode(List< ulong> results,bool isNeedXef=true)
        {
            var xrefResults = new List<TableInfo>();
            foreach (var result in results)
            {
				if (isNeedXef)
				{
					var xrefs = GetCrossReference(result);
					foreach (var xref in xrefs)
					{
						for (var offset = 0; offset <= 0x50; offset++)
						{
							var curAddress = xref - (ulong)offset;
							var info = tableInfos.Find(i => i.offset == curAddress);
							if (info.opcode == 0)
								continue;

							xrefResults.Add(info);
							break;
						}
					}
				}
				else
				{
					for (var offset = 0; offset <= 0x50; offset++)
					{
						var curAddress = result - (ulong)offset;
						var info = tableInfos.Find(i => i.offset == curAddress);
						if (info.opcode == 0)
							continue;

						xrefResults.Add(info);
						break;
					}
				}
			}
				
            if (xrefResults is not null)
            {
                return xrefResults[0].opcode;
            }
            else return default;

        }
        public ulong GetCrossReference(ulong offset, ulong count)
        {
            ulong functionStart = 0;

            count = Math.Max(count, 1);

            for (ulong i = 0; i < count; i++)
            {
                var xrefs = GetCrossReference(i == 0 ? offset : functionStart);
                var curAddr = xrefs[0];
                if (i != count - 1)
                    for (var j = 0; j <= 0x50; j++)
                    {
                        if (((byte*)Start)[curAddr - (ulong)j] != 0xCC)
                            continue;
                        curAddr -= (ulong)(j - 1);
                        functionStart = curAddr;
                        break;
                    }
                else
                    functionStart = curAddr;
            }

            return functionStart;
        }
        public List<ulong> GetCrossReference(ulong offset)
        {


            if (CallFunctions.Count == 0)
            {
                var e8 = FindPattern("E8 ? ? ? ?");
                foreach (var relatives in e8)
                    CallFunctions.Add(new RelativeJump
                    {
                        Source = relatives,
                        Destination = (ulong)ReadCallSig2(relatives)
                    });

                var e9 = FindPattern("E9 ? ? ? ?");
                foreach (var relatives in e9)
                    CallFunctions.Add(new RelativeJump
                    {
                        Source = relatives,
                        Destination = (ulong)ReadCallSig2(relatives)
                    });
            }

            return CallFunctions.Where(i => i.Destination == offset).Select(i => i.Source).ToList();
        }
        private static void ProcessSimpleSwitchCase(ByteArrayCodeReader codeReader, Decoder decoder, ref List<TableInfo> info)
        {
            ulong originalCase = 0;
            ulong currentCase = 0;

            bool 没小表 = true;
            bool 第二个表 = false;
            Instruction? lastInsturction = null;

            while (codeReader.CanReadByte)
            {
                decoder.Decode(out var instr);

                if (instr.OpCode.OpCode == 0XCC)
                    break;

                /*
				var instrString = instr.ToString();

				Console.WriteLine($"0x{instr.Immediate32:X} / {instr.OpCode.Code} / {instrString} / 0x{instr.NearBranch32:X}");*/

                if (lastInsturction == null)
                {
                    lastInsturction = instr;
                    continue;
                }

                switch (lastInsturction.Value.OpCode.Code)
                {
                    // .text: 00000001406BF668 41 81 FA EC 01 00 00                                            cmp r10d, 1ECh
                    case Code.Cmp_rm32_imm32 or Code.Cmp_rm32_imm8:
                        switch (instr.OpCode.Code)
                        {
                            // .text:00000001406BF66F 0F 87 80 00 00 00                                            ja      loc_1406BF6F5
                            case Code.Ja_rel32_64:
                            case Code.Ja_rel8_64:
                                originalCase = lastInsturction.Value.Immediate32;
                                没小表 = false;
                                break;
                            // last case in this switch case
                            // .text:00000001406BF69F 41 83 FA 32                                                     cmp r10d, 32h; '2'
                            // .text:00000001406BF6A3 0F 85 AB 00 00 00                                               jnz loc_1406BF754
                            // .text:00000001406BF6A9 48 C7 44 24 20 60 00 00 00                                      mov[rsp + 38h + var_18], 60h
                            case Code.Jne_rel32_64 or Code.Jne_rel8_64:
                                currentCase += lastInsturction.Value.Immediate32;
                                info.Add(new TableInfo
                                {
                                    opcode = (int)currentCase,
                                    offset = instr.NearBranch32
                                });

                                // Console.WriteLine($" aaa | Code.Jne_rel32_64: {instr.Length} / CurrentCase: 0x{currentCase:X} / 0x{instr.NearBranch32:X}");
                                break;
                            case Code.Je_rel8_64:
                                if (第二个表)
                                {
                                    currentCase = originalCase;
                                    info.Add(new TableInfo
                                    {
                                        opcode = (int)currentCase,
                                        offset = instr.NearBranch32
                                    });
                                }


                                break;
                        }

                        break;
                    // If the last insturction is Je or Return(the beginning of new location)
                    case Code.Je_rel8_64 or Code.Retnq:
                        {
                            if (instr.OpCode.Code is Code.Sub_rm32_imm32 or Code.Sub_rm32_imm8 or Code.Cmp_rm32_imm8 or Code.Cmp_rm32_imm32)
                            {
                                if (lastInsturction.Value.OpCode.Code is Code.Retnq && !第二个表)
                                {
                                    第二个表 = true;
                                    originalCase = currentCase = instr.Immediate32;
                                    // Console.WriteLine($"NewLocation(start+offset) Retnq: 0x{instr.Immediate32:X}");
                                }

                                else
                                {
                                    if (没小表 && currentCase == 0)
                                    {
                                        currentCase = originalCase;
                                    }


                                    currentCase += instr.Immediate32;
                                    info.Add(new TableInfo
                                    {
                                        opcode = (int)currentCase,
                                        offset = lastInsturction.Value.NearBranch32
                                    });



                                    // Console.WriteLine($" bbb | instr.Length: {instr.Length} / CurrentCase: 0x{currentCase:X} / 0x{instr.NearBranch32:X} / 0x{instr.Immediate32:X}");
                                }
                            }

                            break;
                        }
                    // cases that aint covered from above
                    default:
                        {
                            if (lastInsturction.Value.Code is Code.Jne_rel32_64 or Code.Jne_rel8_64 or Code.Movzx_r32_rm16 && instr.OpCode.Code is Code.Mov_rm64_imm32 or Code.Sub_rm32_imm32 or Code.Sub_rm32_imm8)
                            {
                                if (instr.OpCode.Code is Code.Sub_rm32_imm32 or Code.Sub_rm32_imm8)
                                {
                                    // currentCase += instr.Immediate32;
                                    originalCase = instr.Immediate32;
                                    lastInsturction = instr;
                                    continue;
                                }

                                info.Add(new TableInfo
                                {
                                    opcode = (int)originalCase,
                                    offset = instr.IP
                                });
                                // Console.WriteLine($" ccc | Code.Jne_rel32_64: {instr.Length} / CurrentCase: 0x{originalCase:X} / 0x{instr.NearBranch32:X}");
                            }

                            break;
                        }
                }

                lastInsturction = instr;
            }
        }
		private void ProcessJumpTable(ByteArrayCodeReader codeReader, Decoder decoder, ref List<TableInfo> tableInfos)
		{
			var subs = new List<int>() { };
			var indirectTables = new List<ulong>();
			var jumpTables = new List<ulong>();
			uint jumpAdress = 0;
			bool isSub = false;
			while (codeReader.CanReadByte)
			{
				decoder.Decode(out var instr);

				if (instr.OpCode.OpCode == 0XCC)
					break;

				var instrString = instr.ToString();
				if (isSub)
				{
					decoder.IP = instr.MemoryDisplacement64;
					isSub = false;
					continue;

				}
				if (instrString.StartsWith("add"))
				{
					isSub = true;
					subs.Add(instr.Immediate8to32);
					continue;
				}



				if (instrString.StartsWith("mov ecx,[rdx+rax*4"))
				{
					jumpTables.Add(instr.NearBranch64);
				}
			}

			if (jumpTables.Count == 0)
			{

				return;
			}



			var startIndex = 0;

			for (var i = startIndex; i < jumpTables.Count; i++)
			{
				var idx = i;
				var minimumCaseValue = Math.Abs(subs[idx]);
				var jumpTable = jumpTables[idx];

				for (var j = minimumCaseValue; ; j++)
				{
					var jumpTableIndex = j - minimumCaseValue;
					var tableAddress = (int)jumpTable + jumpTableIndex * 4;
					var tableByte1 = Marshal.ReadByte(Start + tableAddress);
					var tableByte2 = Marshal.ReadByte(Start + tableAddress + 1);
					if (tableByte1 == 0xCC && tableByte2 == 0xCC)
						break;

					var location = Marshal.ReadInt32(Start + tableAddress);
					tableInfos.Add(new TableInfo
					{
						opcode = j,
						offset = (ulong)location
					});
					// Console.WriteLine($"DirectTable#{jumpTableIndex}({j}) 0x{location:X}");
				}
			}
		}

		public byte[] ReadBytes(ulong offset, ulong size)
        {
            var data = new byte[size];
            var STAR = (ulong)Start + offset;
            if (offset > dataLength)
            {
                return default;
            }
            for (ulong i = 0; i < size; i++)
            {

                data[i] = ((byte*)STAR)[i];
            }
            return data;
        }
    }
    public struct TableInfo
    {
        public int opcode;
        public ulong offset;
    }
}
