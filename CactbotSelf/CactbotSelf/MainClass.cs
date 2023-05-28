using System;
using System.Collections.Generic;
using System.Data;
using System.Windows.Forms;
using System.Linq;
using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin.Common;
using FFXIV_ACT_Plugin.Memory;
using System.Runtime.InteropServices;
using FFXIV_ACT_Plugin.Common.Models;
using System.Reflection;
using uint8_t = System.Byte;
using uint16_t = System.UInt16;
using uint32_t = System.UInt32;
using System.IO;
using Microsoft.MinIoC;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Runtime.CompilerServices;
using Machina.Infrastructure;
using RainbowMage.OverlayPlugin;
using System.Xml.Linq;
using System.Data.SqlTypes;
using System.Text;

namespace CactbotSelf
{
    public class MainClass 
    {
        public static MainClass mainClass;
        private static Type MessageType = null;
        private static FFXIV_ACT_Plugin.FFXIV_ACT_Plugin ffxivPlugin;
        private Dictionary<string, Dictionary<string, OpcodeConfigEntry>> config = new Dictionary<string, Dictionary<string, OpcodeConfigEntry>>();
        string opcodeDirc;
        //private static ushort ActorCast_Opcode ;

        private static MoreLogLineUI PluginUI;

        private static ICombatantManager CombatantManager;
        private static IDataRepository DataManager;

        private const string PluginName = "CactbotSelf";

        #region PluginInit
        public void InitPlugin( MoreLogLineUI pluginUI)
        {
            mainClass = this;
            PluginUI=pluginUI;
            if (Offsets.MapeffectOpcode>0)
            {
                MapEffect = (ushort)Offsets.MapeffectOpcode;
                ObjectSpawn= (ushort)Offsets.ObjectOpcode;
                PluginUI.Log($"Found MapEffect opcode {MapEffect:X4}");
                PluginUI.Log($"Found ObjectSpawn opcode {ObjectSpawn:X4}");
            }

          
            //ActorMove = (ushort)FindOpcode("ActorMove");
            //ObjectSpawn = (ushort)FindOpcode("ObjectSpawn");
            //WantOpcode = (ushort)FindOpcode("WantOpcode");
            //MapEffect = (ushort)FindOpcode("MapEffect");

            var mach = Assembly.Load("Machina.FFXIV");
            MessageType = mach.GetType("Machina.FFXIV.Headers.Server_MessageType");
            ActorCast = (ushort)GetOpcode("ActorCast");
            //MessageBox.Show(ActorCast.ToString());
            ActorSetPos = (ushort)GetOpcode("ActorSetPos");
            ActorMove = (ushort)GetOpcode("ActorMove");
            ActorControl = (ushort)GetOpcode("ActorControl");
            ActorControlSelf = (ushort)GetOpcode("ActorControlSelf");
			NpcSpawnOpcode= (ushort)GetOpcode("NpcSpawn");
			//MessageBox.Show(NpcSpawnOpcode.ToString("X4"));

			HideTab();

            GetFfxivPlugin();
            var iocContainer = ffxivPlugin.GetType().GetField("_iocContainer", BindingFlags.NonPublic | BindingFlags.Instance)?.GetValue(ffxivPlugin) as Microsoft.MinIoC.Container;
            //var a = Assembly.Load("OverlayPlugin");
            //var b = a.GetType("RainbowMage.OverlayPlugin.PluginLoader");
            //var field = b.GetField("pluginDirectory", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            //var e = GetContainer();
            //opcodeDirc = Path.Combine(field.GetValue(e.pluginObj).ToString(), "resources", "opcodes.jsonc");

            //DataManager = iocContainer.Resolve<IDataRepository>();

            //var jsonData = File.ReadAllText(opcodeDirc);
            //config = JsonConvert.DeserializeAnonymousType(jsonData, config);
            //var iocContainer = (TinyIoCContainer)typeof(FFXIV_ACT_Plugin.FFXIV_ACT_Plugin).GetField("_iocContainer", BindingFlags.NonPublic | BindingFlags.Instance)?.GetValue(ffxivPlugin);
            if (iocContainer != null) CombatantManager = iocContainer.Resolve<ICombatantManager>();
            ffxivPlugin.DataSubscription.NetworkReceived += new NetworkReceivedDelegate(this.MoreLogLines_OnNetworkReceived);
        }
        public uint GetMapeffect()
        {
            var gameVersion = DataManager.GetGameVersion();
            if (gameVersion == null)
            {
                return default;
            }
            if (!config.ContainsKey(gameVersion))
            {
                return default;
            }
            var versionOpcodes = config[gameVersion];
            if (!versionOpcodes.ContainsKey("MapEffect"))
            {
                return default;
            }
            return versionOpcodes["MapEffect"].opcode;
        }
        public static ActPluginData GetContainer()
        {
            foreach (var entry in ActGlobals.oFormActMain.ActPlugins)
            {
                if (entry.pluginObj != null && entry.pluginObj.GetType().FullName == "RainbowMage.OverlayPlugin.PluginLoader")
                {
                    return entry;
                }
            }

            throw new Exception("Couldn't find OverlayPlugin!");
        }
        private void ExtractOpCode(Task<string> task)
        {
            try
            {
                var regions = JsonConvert.DeserializeObject<List<OpcodeRegion>>(task.Result);
                if (regions == null)
                {
                    PluginUI.Log("No regions found in opcode list");
                    return;
                }

                var region = regions.Find(r => r.Region == GetGameRegion().ToString());
                if (region == null || region.Lists == null)
                {
                    PluginUI.Log("No global region found in opcode list");
                    return;
                }

                if (!region.Lists.TryGetValue("ServerZoneIpcType", out List<OpcodeList>? serverZoneIpcTypes) || serverZoneIpcTypes == null)
                {
                    PluginUI.Log("No ServerZoneIpcType in opcode list");
                    return;
                }

                var objectSpawn = serverZoneIpcTypes.Find(opcode => opcode.Name == "ObjectSpawn");
                if (objectSpawn == null)
                {
                    PluginUI.Log("No ObjectSpawn opcode in ServerZoneIpcType");
                    return;
                }
                ObjectSpawn = objectSpawn.Opcode;
                PluginUI.Log($"Found ObjectSpawn opcode {ObjectSpawn:X4}");
                var mapEffect = serverZoneIpcTypes.Find(opcode => opcode.Name == "EnvironmentControl");
                if (mapEffect == null)
                {
                    PluginUI.Log("No EnvironmentControl opcode in ServerZoneIpcType");
                    return;
                }

                PluginUI.Log($"Found MapEffect opcode {MapEffect:X4}");
            }
            catch (Exception e)
            {
                PluginUI.Log($"Could not download/extract opcodes: {e.Message}");
            }
        }
        public enum GameRegion
        {
            Global,
            CN,
            KR,
        }
        public GameRegion GetGameRegion()
        {
            try
            {
                var mach = Assembly.Load("Machina.FFXIV");
                var opcode_manager_type = mach.GetType("Machina.FFXIV.Headers.Opcodes.OpcodeManager");
                var opcode_manager = opcode_manager_type.GetProperty("Instance").GetValue(null);
                var machina_region = opcode_manager_type.GetProperty("GameRegion").GetValue(opcode_manager).ToString();
                switch (machina_region)
                {
                    case "Chinese":
                        return GameRegion.CN;
                    case "Korean":
                        return GameRegion.KR;
                    default:
                        return GameRegion.Global;
                }
            }
            catch (Exception e)
            {
                PluginUI.Log(e.Message);
                return GameRegion.Global;
            }
        }
        public void HideTab()
        {
            var oFormActMain = ActGlobals.oFormActMain;
            var tcPlugins = (TabControl)typeof(FormActMain).GetField("tcPlugins", BindingFlags.NonPublic | BindingFlags.Instance)?.GetValue(oFormActMain);
            if (tcPlugins == null) return;
            foreach (TabPage tab in tcPlugins.TabPages)
            {
                if (string.Equals(tab.Text, PluginName, StringComparison.CurrentCultureIgnoreCase))
                    tcPlugins.TabPages.Remove(tab);
            }
        }

        private void GetFfxivPlugin()
        {
            //ffxivPlugin = null;
            //var ffxivActPlugins = ActGlobals.oFormActMain.ActPlugins.Where(x => x.pluginFile.Name.ToUpper().Contains("FFXIV_ACT_Plugin".ToUpper()) && x.lblPluginStatus.Text.ToUpper().Contains("FFXIV Plugin Started.".ToUpper())).ToList();
            //if (ffxivActPlugins.Count != 1)
            //    return;
            //ffxivPlugin = (FFXIV_ACT_Plugin.FFXIV_ACT_Plugin)ffxivActPlugins[0].pluginObj;
            FFXIV_ACT_Plugin.FFXIV_ACT_Plugin ffxivActPlugins = null;
            if (ffxivPlugin == null)
            {

                var ffxivPlugins = (
                    from x in ActGlobals.oFormActMain.ActPlugins
                    where
                    x.pluginFile.Name.ToUpper().Contains("FFXIV_ACT_Plugin".ToUpper())
                    select
                    x.pluginObj).FirstOrDefault();


                ffxivPlugin = (FFXIV_ACT_Plugin.FFXIV_ACT_Plugin)ffxivPlugins;
            }
        }

        public void DeInitPlugin()
        {
            ffxivPlugin.DataSubscription.NetworkReceived -= new NetworkReceivedDelegate(this.MoreLogLines_OnNetworkReceived);
            PluginUI.SaveSettings();
        }
		#endregion
		private UInt16 NpcSpawnOpcode;
		[StructLayout(LayoutKind.Explicit, Size = 0x2a0)]
		public unsafe struct NpcSpawn
		{
			[FieldOffset(0x0)]
			public uint gimmickId; // needs to be existing in the map, mob will snap to it
			[FieldOffset(4)]
			public byte u2b;
			[FieldOffset(5)]
			public byte u2ab;
			[FieldOffset(6)]
			public byte gmRank;
			[FieldOffset(7)]
			public byte u3b;
			[FieldOffset(8)]
			public byte aggressionMode; // 1 passive, 2 aggressive
			[FieldOffset(9)]
			public byte onlineStatus;
			[FieldOffset(10)]
			public byte u3c;
			[FieldOffset(11)]
			public byte pose;
			[FieldOffset(12)]
			public uint u4;
			[FieldOffset(16)]
			public long targetId;
			[FieldOffset(24)]
			public uint u6;
			[FieldOffset(28)]
			public uint u7;
			[FieldOffset(32)]
			public long mainWeaponModel;
			[FieldOffset(40)]
			public long secWeaponModel;
			[FieldOffset(48)]
			public long craftToolModel;
			[FieldOffset(56)]
			public uint u14;
			[FieldOffset(60)]
			public uint u15;
			[FieldOffset(64)]
			public uint bNPCBase; //dataID
			[FieldOffset(68)]
			public uint bNPCName;
			[FieldOffset(72)]
			public uint levelId;
			[FieldOffset(76)]
			public uint u19;
			[FieldOffset(80)]
			public uint directorId;
			[FieldOffset(84)]
			public uint spawnerId;  //objectID
			[FieldOffset(88)]
			public uint parentActorId;
			[FieldOffset(92)]
			public uint hPMax;
			[FieldOffset(96)]
			public uint hPCurr;
			[FieldOffset(100)]
			public uint displayFlags;
			[FieldOffset(104)]
			public ushort fateID;
			[FieldOffset(106)]
			public ushort mPCurr;
			[FieldOffset(108)]
			public ushort unknown1; // 0
			[FieldOffset(110)]
			public ushort unknown2; // 0 or pretty big numbers > 30000
			[FieldOffset(112)]
			public ushort modelChara;
			[FieldOffset(114)]
			public ushort rotation;
			[FieldOffset(116)]
			public ushort activeMinion;
			[FieldOffset(118)]
			public byte spawnIndex;
			[FieldOffset(119)]
			public byte state;
			[FieldOffset(120)]
			public byte persistantEmote;
			[FieldOffset(121)]
			public byte modelType;
			[FieldOffset(122)]
			public byte subtype;
			[FieldOffset(123)]
			public uint8_t voice;  //2为正常显示怪物 1应该是玩家
			[FieldOffset(124)]
			public uint16_t u25c;
			[FieldOffset(126)]
			public uint8_t enemyType;
			[FieldOffset(127)]
			public uint8_t level;
			[FieldOffset(128)]
			public uint8_t classJob;
			[FieldOffset(129)]
			public uint8_t u26d;
			[FieldOffset(130)]
			public uint16_t u27a;
			[FieldOffset(132)]
			public uint8_t currentMount;
			[FieldOffset(133)]
			public uint8_t mountHead;
			[FieldOffset(134)]
			public uint8_t mountBody;
			[FieldOffset(135)]
			public uint8_t mountFeet;
			[FieldOffset(136)]
			public uint8_t mountColor;
			[FieldOffset(137)]
			public uint8_t scale;
			[FieldOffset(138)]
			public uint16_t elementalLevel; // Eureka
			[FieldOffset(140)]
			public uint16_t element; // Eureka
									 //[MarshalAs(UnmanagedType.ByValArray, SizeConst = 30)]
									 //public Status[] effect;
			[FieldOffset(142)]
			public fixed byte Effects1[30 * 3 * 4];
			[FieldOffset(508)]
			public FFXIVARR_POSITION3 pos;
			[FieldOffset(520)]
			public fixed uint32_t models[10];
			[FieldOffset(560)]
			public fixed byte name[0x40];
			[FieldOffset(624)]
			public fixed uint8_t look[26];
			[FieldOffset(626)]
			public fixed byte fcTag[12];
			[FieldOffset(638)]

			public uint32_t unk30;
			[FieldOffset(646)]
			public uint32_t unk31;
			[FieldOffset(654)]
			public uint8_t bNPCPartSlot;
			[FieldOffset(655)]
			public uint8_t unk32;
			[FieldOffset(656)]
			public uint16_t unk33;
			[FieldOffset(660)]
			public uint32_t unk34;
		}

		[StructLayout(LayoutKind.Explicit)]
        public unsafe struct ServerMessageHeader
        {
            [FieldOffset(0)]
            public uint MessageLength;
            [FieldOffset(4)]
            public uint ActorID;
            [FieldOffset(8)]
            public uint LoginUserID;
            [FieldOffset(12)]
            public uint Unknown1;
            [FieldOffset(16)]
            public ushort Unknown2;
            [FieldOffset(18)]
            public ushort MessageType;
            [FieldOffset(20)]
            public uint Unknown3;
            [FieldOffset(24)]
            public uint Seconds;
            [FieldOffset(28)]
            public uint Unknown4;
        }

        //https://github.com/SapphireServer/Sapphire/blob/master/src/common/Network/PacketDef/Zone/ServerZoneDef.h
        private UInt16 ActorMove;

        [StructLayout(LayoutKind.Explicit, Size = 0xE)]
        public unsafe struct FFXIVIpcActorMove
        {
            [FieldOffset(0)]
            public uint16_t headRotation;
            [FieldOffset(2)]
            public uint8_t rotation;
            [FieldOffset(6)]
            public uint16_t posX;
            [FieldOffset(8)]
            public uint16_t posY;
            [FieldOffset(0xA)]
            public uint16_t posZ;
        }
        private UInt16 WantOpcode;
        [StructLayout(LayoutKind.Explicit, Size = 0x10)]
        public unsafe struct FFXIVIpcWeatherChane
        {
            [FieldOffset(0)]
            public uint16_t parm1;
            [FieldOffset(2)]
            public uint16_t parm2;
            [FieldOffset(6)]
            public uint16_t parm3;
        }

        private UInt16 MapEffect;
        [StructLayout(LayoutKind.Explicit, Size = 0x30)]
        public unsafe struct FFXIVIpcMapEffect
        {
            [FieldOffset(0)]
            public uint32_t directorId;
            [FieldOffset(4)]
            public uint32_t State;
            [FieldOffset(8)]
            public uint16_t parm3;
            [FieldOffset(12)]
            public uint16_t parm4;
        }
        private UInt16 ActorCast;
        [StructLayout(LayoutKind.Explicit, Size = 0x30)]
        public unsafe struct FFXIVIpcActorCast
        {
            [FieldOffset(0)]
            public uint16_t ActionID;
            [FieldOffset(2)]
            public uint8_t SkillType;
            [FieldOffset(3)]
            public uint8_t Unknown;
            [FieldOffset(4)]
            public uint32_t Unknown1;
            [FieldOffset(8)]
            public float CastTime;
            [FieldOffset(12)]
            public uint32_t TargetID;
            [FieldOffset(16)]
            public uint16_t Rotation;
            [FieldOffset(18)]
            public uint16_t flag; // 1 = interruptible blinking cast bar
            [FieldOffset(24)]
            public uint16_t posX;
            [FieldOffset(26)]
            public uint16_t posY;
            [FieldOffset(28)]
            public uint16_t posZ;
        }

        private UInt16 ActorSetPos;
        [StructLayout(LayoutKind.Explicit, Size = 0x30)]
        public unsafe struct FFXIVIpcActorSetPos
        {
            [FieldOffset(0)]
            public uint16_t r16;
            [FieldOffset(2)]
            public uint8_t waitForLoad;
            [FieldOffset(3)]
            public uint8_t unknown1;
            [FieldOffset(4)]
            public uint32_t unknown2;
            [FieldOffset(8)]
            public float posX;
            [FieldOffset(12)]
            public float posY;
            [FieldOffset(16)]
            public float posZ;
            [FieldOffset(20)]
            public uint32_t unknown3;

        }


        private UInt16 ObjectSpawn;
        //[StructLayout(LayoutKind.Explicit, Size = 0xE)]

        [StructLayout(LayoutKind.Explicit, Size = 64)]
        public unsafe struct FFXIVIpcObjectSpawn
        {
            [FieldOffset(0)]
            public uint8_t spawnIndex;
            [FieldOffset(1)]
            public uint8_t objKind;
            [FieldOffset(2)]
            public uint8_t state;
            [FieldOffset(3)]
            public uint8_t unknown3;
            [FieldOffset(4)]
            public uint32_t objId;
            [FieldOffset(8)]
            public uint32_t actorId;
            [FieldOffset(12)]
            public uint32_t levelId;
            [FieldOffset(16)]
            public uint32_t unknown10;
            [FieldOffset(20)]
            public uint32_t someActorId14;
            [FieldOffset(24)]
            public uint32_t gimmickId;
            [FieldOffset(28)]
            public float scale;
            [FieldOffset(32)]
            public uint16_t unknown20a;
            [FieldOffset(34)]
            public uint16_t rotation;
            [FieldOffset(36)]
            public uint16_t unknown24a;
            [FieldOffset(38)]
            public uint16_t unknown24b;
            [FieldOffset(40)]
            public uint16_t flag;
            [FieldOffset(42)]
            public uint16_t unknown28c;
            [FieldOffset(44)]
            public uint32_t housingLink;
            [FieldOffset(48)]
            public FFXIVARR_POSITION3 position;
            [FieldOffset(50)]
            public uint16_t unknown3C;
            [FieldOffset(52)]
            public uint16_t unknown3E;
        }
        [StructLayout(LayoutKind.Explicit, Size = 12)]
        public struct FFXIVARR_POSITION3
        {
            [FieldOffset(0)]
            public float x;
            [FieldOffset(4)]
            public float y;
            [FieldOffset(8)]
            public float z;
        }
        public enum Server_ActorControlCategory : ushort
        {
            HoT_DoT = 0x17,
            CancelAbility = 0x0f,
            Death = 0x06,
            TargetIcon = 0x22,
            Tether = 0x23,
            GainEffect = 0x14,
            LoseEffect = 0x15,
            UpdateEffect = 0x16,
            Targetable = 0x36,
            DirectorUpdate = 0x6d,
            LimitBreak = 0x1f9
        };
        private UInt16 ActorControl;
        private UInt16 ActorControlSelf;
        [StructLayout(LayoutKind.Explicit, Size = 24)]
        public struct ActorControlStruct
        {
            [FieldOffset(0x0)] public Server_ActorControlCategory category;
            [FieldOffset(0x2)] public ushort padding;
            [FieldOffset(0x4)] public uint param1;
            [FieldOffset(0x8)] public uint type;
            [FieldOffset(0xC)] public uint param3;
            [FieldOffset(0x10)] public uint param4;
            [FieldOffset(0x14)] public uint padding1;

        }
        [StructLayout(LayoutKind.Sequential, Pack = 1)]
        public unsafe struct Server_EnvironmentControl
        {
            public uint FeatureID; // seen 0x80xxxxxx, seems to be unique identifier of controlled feature
            public uint State; // typically hiword and loword both have one bit set
            public byte Index; // if feature has multiple elements, this is a 0-based index of element
            public byte u0; // padding?
            public ushort u1; // padding?
            public uint u2; // padding?
        }
        private static object GetEnumValue(Type type, string name)
        {
            foreach (var value in type.GetEnumValues())
            {
                if (value.ToString() == name)
                    return Convert.ChangeType(value, Enum.GetUnderlyingType(type));
            }

            throw new Exception($"Enum value {name} not found in {type}!");
        }
        private static ushort GetOpcode(string name)
        {
            // FFXIV_ACT_Plugin 2.0.4.14 converted Server_MessageType from enum to struct. Deal with each type appropriately.
            if (MessageType.IsEnum)
            {
                return (ushort)GetEnumValue(MessageType, name);
            }
            else
            {
                var value = MessageType.GetField(name).GetValue(null);
                return (ushort)value.GetType().GetProperty("InternalValue").GetValue(value);
            }
        }

        private unsafe void MoreLogLines_OnNetworkReceived(string connection, long epoch, byte[] message)
        {
            if (message.Length < sizeof(ServerMessageHeader))
            {
                return;
            }
            try
            {
                fixed (byte* ptr = message)
                {
                    //通过op的配置来读取mapeffect
                    //               if (GetMapeffect()!=default)
                    //               {
                    //                   MapEffect = (ushort)GetMapeffect();

                    //}
                    var header = (ServerMessageHeader*)ptr;
                    var dataPtr = ptr + 0x20;
                    if (header->MessageType == ActorMove)
                        ProcessActorMove(header->ActorID, (FFXIVIpcActorMove*)dataPtr);
                    //if (header->MessageType == WantOpcode)
                    //    ProcesWeatherChane(header->ActorID, header->MessageLength, message);
                    if (header->MessageType == ObjectSpawn)
                        ProcessObjectSpawn(header->ActorID, (FFXIVIpcObjectSpawn*)dataPtr, epoch);
                    if (header->MessageType == MapEffect)
                        ProcesMapEffect(header->ActorID, (FFXIVIpcMapEffect*)dataPtr, epoch);
                    if (header->MessageType == ActorCast)
                        ProcesActorCast(header->ActorID, (FFXIVIpcActorCast*)dataPtr);
                    if (header->MessageType == ActorSetPos)
                        ProcesActorSetPos(header->ActorID, (FFXIVIpcActorSetPos*)dataPtr);
                    if (header->MessageType == ActorControl)
                        ProcesActorControl(header->ActorID, (ActorControlStruct*)dataPtr, epoch);
					if (header->MessageType == NpcSpawnOpcode)
						ProcesNpcSpawnOpcode(header->ActorID, (NpcSpawn*)dataPtr, epoch);

					//switch (header->MessageType) {
					//    case (ActorMove):
					//        ProcessActorMove(header->ActorID, (FFXIVIpcActorMove*)dataPtr);
					//        break;
					//    case (WeatherChane):
					//        ProcesWeatherChane(header->ActorID, (FFXIVIpcWeatherChane*)dataPtr);
					//        break;
					//    case (MapEffect):
					//        ProcesMapEffect(header->ActorID, (FFXIVIpcMapEffect*)dataPtr);
					//        break;
					//    case (ObjectSpawn):
					//        //PluginUI.Log(header->MessageLength.ToString());
					//        ProcessObjectSpawn(header->ActorID, (FFXIVIpcObjectSpawn*)dataPtr);
					//        break;
					//    default:
					//        return;
					//}
				}

            }
            catch (Exception ex)
            {

                PluginUI.Log($"Error:{ex}");


            }
        }



		private Combatant GetCombatantByID(uint ID)
        {
            return CombatantManager.GetCombatantById(ID);
        }

        private string GetCombatantNameByID(uint ID)
        {
            var combant = GetCombatantByID(ID);
            var Name = "";
            Name = combant == null ? "找不到" : combant.Name;
            return Name;
        }
        private ActPluginData GetPluginData()
        {
            return ActGlobals.oFormActMain.ActPlugins.FirstOrDefault(plugin => {
                if (!plugin.cbEnabled.Checked || plugin.pluginObj == null)
                    return false;
                return plugin.lblPluginTitle.Text.StartsWith("FFXIV_ACT_Plugin");
            });
        }
        [MethodImpl(MethodImplOptions.NoInlining)]
        public bool WriteLogLineImpl(string type, string line, long epoch)
        {
            var plugin = ffxivPlugin;
            if (plugin == null) return false;
            var iocContainer = plugin.GetType().GetField("_iocContainer", BindingFlags.NonPublic | BindingFlags.Instance).GetValue(plugin);
            var getServiceMethod = iocContainer.GetType().GetMethod("GetService");
            DateTime packetDate = ConversionUtility.EpochToDateTime(epoch).ToLocalTime();
            var logOutput = getServiceMethod.Invoke(iocContainer, new object[] { typeof(FFXIV_ACT_Plugin.Logfile.ILogOutput) }) as FFXIV_ACT_Plugin.Logfile.ILogOutput;
            line = $"] ChatLog 00:0:{type}:" + line;
            logOutput.WriteLine((FFXIV_ACT_Plugin.Logfile.LogMessageType)254, packetDate, line);

            return true;
        }
        private unsafe void ProcessActorMove(uint actorId, FFXIVIpcActorMove* message)
        {
            if (PluginUI.startMove)
            {
                var obj = GetCombatantByID(actorId);
                if (obj == null)
                    return;
                if (obj.type == 1) return;
                if (obj.OwnerID < 0x40000000 && obj.OwnerID > 0) return;
                var log = $"{actorId:X}:{obj.Name}:{(message->posX - 32767) / 32.767:f2}:{(message->posY - 32767) / 32.767:f2}:{(message->posZ - 32767) / 32.767:f2}:{Convert.ToDouble((message->headRotation - 32767)) * Math.PI / 32767:f2}:";
                Log("100", log);
			}

        }
		internal static unsafe string ReadTerminatedString(byte* ptr)
		{
			return Encoding.UTF8.GetString(ReadTerminatedBytes(ptr));
		}
		private static unsafe byte[] ReadTerminatedBytes(byte* ptr)
		{
			if (ptr == null)
			{
				return new byte[0];
			}

			var bytes = new List<byte>();
			while (*ptr != 0)
			{
				bytes.Add(*ptr);
				ptr += 1;
			}

			return bytes.ToArray();
		}
		private unsafe void ProcesNpcSpawnOpcode(uint actorID, NpcSpawn* dataPtr, long epoch)
		{
            var name= ReadTerminatedString(dataPtr->name);
            if (dataPtr->spawnerId < 0x20000000|| actorID <  0x20000000)
            {
                return;
            }
            var log = $"{actorID:X}:{name}:{dataPtr->targetId:X}:{dataPtr->bNPCBase}:{dataPtr->bNPCName}:{dataPtr->parentActorId:X}";
			Log("107", log);
			WriteLogLineImpl("107", log, epoch);
		}
		private unsafe void ProcesWeatherChane(uint actorId, uint lenth, byte[] message)
        {
            var obj = GetCombatantByID(actorId);
            if (obj == null)
                return;
            string a = null;
            for (int i = 0; i < lenth - 34; i = i + 4)
            {

                a = a + $"{BitConverter.ToUInt32(message, 20 + i):X4}:";
            }
            var log = $"{actorId:X}:" + a;
            Log("102", log);

        }
        private unsafe void ProcesMapEffect(uint actorId, FFXIVIpcMapEffect* message, long epoch)
        {
            var obj = GetCombatantByID(actorId);
            var log = $"{actorId:X}:{message->directorId:X8}:{message->State:X8}:{message->parm3:X8}:{message->parm4:X8}:";
            Log("103", log);

            WriteLogLineImpl("103", log, epoch);
        }
        private unsafe void ProcesActorControl(uint actorID, ActorControlStruct* dataPtr, long epoch)
        {
            var obj = GetCombatantByID(actorID);
            var type = dataPtr->category;

            if (type != (Server_ActorControlCategory)407 && type != (Server_ActorControlCategory)0x1e && type != (Server_ActorControlCategory)49)
            {
                return;
            }

            if (obj == null)
            {
                var log = $"{actorID:X}::{dataPtr->category:X}:{dataPtr->padding:X4}:{dataPtr->param1:X8}:{dataPtr->type:X8}:{dataPtr->param3:X8}:{dataPtr->param4:X8}::{dataPtr->padding1:X8}:";
                Log("106", log);
                WriteLogLineImpl("106", log, epoch);

            }
            if (obj != null)
            {
                var log = $"{actorID:X}:{obj.Name}:{dataPtr->category:X}:{dataPtr->padding:X4}:{dataPtr->param1:X8}:{dataPtr->type:X8}:{dataPtr->param3:X8}:{dataPtr->param4:X8}::{dataPtr->padding1:X8}:";
                Log("106", log);
                WriteLogLineImpl("106", log, epoch);
            }


        }
        private unsafe void ProcesActorCast(uint actorId, FFXIVIpcActorCast* message)
        {
            try
            {

                if (PluginUI.startCast)
                {
                    var obj = GetCombatantByID(actorId);
                    if (obj == null)
                    {
                        var log = $"{actorId:X}::{message->ActionID:X4}:{message->SkillType:X2}:{message->CastTime:f2}:{message->TargetID:X8}:{"null"}:{message->flag:X2}::{(message->posX - 32767) / 32.767:f2}:{(message->posZ - 32767) / 32.767:f2}:{(message->posY - 32767) / 32.767:f2}:";
                        Log("104", log);
                    }
                    else
                    {
                        var objName = GetCombatantNameByID(actorId);
                        if (obj.type != 2) return;
                        var a = message->TargetID;
                        var target = GetCombatantByID(a);
                        if (target == null)
                        {
                            var log = $"{actorId:X}:{objName}:{message->ActionID:X4}:{message->SkillType:X2}:{message->CastTime:f2}:{message->TargetID:X8}:{"null"}:{message->flag:X2}:{obj.Heading:f2}:{(message->posX - 32767) / 32.767:f2}:{(message->posZ - 32767) / 32.767:f2}:{(message->posY - 32767) / 32.767:f2}:";
                            Log("104", log);
                        }
                        else
                        {
                            var log = $"{actorId:X}:{objName}:{message->ActionID:X4}:{message->SkillType:X2}:{message->CastTime:f2}:{message->TargetID:X8}:{target.Name}:{message->flag:X2}:{Convert.ToDouble((message->Rotation - 32767)) * Math.PI / 32767:f2}:{(message->posX - 32767) / 32.767:f2}:{(message->posZ - 32767) / 32.767:f2}:{(message->posY - 32767) / 32.767:f2}:";
                            Log("104", log);
                        }
                    }

                }
            }
            catch (Exception e)
            {

                var err = e;
                Log("104", err.Message);
            }



        }
        private unsafe void ProcesActorSetPos(uint actorId, FFXIVIpcActorSetPos* message)
        {
            if (PluginUI.starSet)
            {
                var obj = GetCombatantByID(actorId);
                if (obj == null)
                {
                    var log = $"{actorId:X}:{message->r16:X4}:{message->waitForLoad:X2}:{message->unknown1:X2}:{message->unknown2:X2}:{message->posX:f2}:{message->posZ:f2}:{message->posY:f2}::";
                    Log("105", log);
                }
                else
                {
                    if (obj == null) return;
                    if (obj.type == 1) return;
                    if (obj.OwnerID < 0x40000000 && obj.OwnerID > 0) return;
                    var BNPCID = obj.BNpcID == 0 ? "" : $"{obj.BNpcID}";
                    var log = $"{actorId:X}:{message->r16:X4}:{message->waitForLoad:X2}:{message->unknown1:X2}:{message->unknown2:X2}:{message->posX:f2}:{message->posZ:f2}:{message->posY:f2}:{BNPCID}:";
                    Log("105", log);
                }

            }

        }

        private unsafe void ProcessObjectSpawn(uint actorId, FFXIVIpcObjectSpawn* message, long epoch)
        {
            //PluginUI.Log($"ActorFormHead:{actorId:X8}");
            //PluginUI.Log($"Actor:{message->actorId:X8}");
            //PluginUI.Log($"Object:{message->objId:X8}");
            //PluginUI.Log($"ObjectKind:{message->objKind:X2}");
            //PluginUI.Log($"{message->spawnIndex:X2} {message->objKind:X2} {message->state:X2} {message->objId:X8} {message->actorId:X8} {message->position.x},{message->position.y},{message->position.z}");
            if (message->unknown3 != 0 || (message->state != 4 && message->state != 5)) return;
            var log = $"{actorId:X8}:{message->unknown3:X2}{message->state:X2}:{message->objKind:X2}{message->spawnIndex:X2}:{message->objId:X4}:{message->someActorId14:X8}:{message->position.x:f2}:{message->position.z:f2}:{message->position.y:f2}:";
            Log("101", log);
            WriteLogLineImpl("101", log, epoch);
            //PluginUI.Log($"{message->unknown3:X2}{message->state:X2} {message->objKind:X2} {message->spawnIndex:X2}|{message->objKind:X8}|{message->actorId:X8}|{message->levelId:X8}|{message->unknown10:X8}|{message->someActorId14:X8}|{message->gimmickId:X8}|{message->scale}|{message->rotation:X4}{message->unknown20a:X4}| {message->position.x},{message->position.y},{message->position.z}");
        }


        //偷獭爹的
        private void Log(string type, string message)
        {
            var time = (DateTime.Now).ToString("HH:mm:ss");
            var text = $"[{time}] [{type}] {message.Trim()}";

            PluginUI.Log(text);

            text = $"00|{DateTime.Now:O}|0|{type}:{message}|";                    //解析插件数据格式化
            ActGlobals.oFormActMain.ParseRawLogLine(false, DateTime.Now, $"{text}"); //插入ACT日志
        }

        //private void InitializeComponent()
        //{
        //    this.SuspendLayout();
        //    // 
        //    // MainClass
        //    // 
        //    this.Name = "MainClass";
        //    this.Size = new System.Drawing.Size(161, 161);
        //    this.ResumeLayout(false);

        //}
    }
    interface IOpcodeConfigEntry
    {
        uint opcode { get; }
        uint size { get; }
    }

    [JsonObject(NamingStrategyType = typeof(Newtonsoft.Json.Serialization.DefaultNamingStrategy))]
    class OpcodeConfigEntry : IOpcodeConfigEntry
    {
        public uint opcode { get; set; }
        public uint size { get; set; }
    }
    public class OpcodeRegion
    {
        public string? Version { get; set; }
        public string? Region { get; set; }
        public Dictionary<string, List<OpcodeList>>? Lists { get; set; }
    }
    public class OpcodeList
    {
        public string? Name { get; set; }
        public ushort Opcode { get; set; }
    }
}
