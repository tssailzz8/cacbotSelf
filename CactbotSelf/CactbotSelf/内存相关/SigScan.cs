// Copyright © 2021 Ravahn - All Rights Reserved
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY. without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see<http://www.gnu.org/licenses/>.

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;

namespace CactbotSelf
{
    public enum SignatureType
    {
        ChatLog = 1,
        MobArray = 2,
        PartyList = 3,
        ServerTime = 4,
        ZoneID = 5,
        Player = 6,
        MapID = 7,
    }

    public class SigScan
    {
        private readonly Dictionary<SignatureType, int[]> _signatures = new Dictionary<SignatureType, int[]>()
        {
            { SignatureType.ChatLog, SignatureStringToByteArray("488bda498bf8418bd1488bf1**********488d05") },
            { SignatureType.MobArray, SignatureStringToByteArray("48c1ea0381faa9010000****8bc2488d0d") },
            { SignatureType.PartyList, SignatureStringToByteArray("8b7c24440fb66c2440400fb6d5488d0d") },
            { SignatureType.ServerTime, SignatureStringToByteArray("448b4e2041b805000000488b0d") },
            { SignatureType.ZoneID, SignatureStringToByteArray("f30f1043044c8d836cffffff0fb705") },
            { SignatureType.Player, SignatureStringToByteArray("83f9ff7412448b048e8bd3488d0d" ) },
            { SignatureType.MapID, SignatureStringToByteArray("84c00f848a0000008b0d" ) },
        };


        public unsafe Dictionary<SignatureType, int> Read(IntPtr library)
        {
            Dictionary<SignatureType, int> ret = new Dictionary<SignatureType, int>();
            List<SignatureType> signatureTypes = new List<SignatureType>((SignatureType[])Enum.GetValues(typeof(SignatureType)));

            NativeMethods.MODULEINFO info = new NativeMethods.MODULEINFO();
            if (!NativeMethods.GetModuleInformation(Process.GetCurrentProcess().Handle, library, out info, (uint)sizeof(NativeMethods.MODULEINFO)))
            {
                Trace.Write($"{nameof(SigScan)}.{nameof(Read)}: Cannot get module size for supplied library.");
                return ret;
            }

            IntPtr startAddress = info.lpBaseOfDll;
            IntPtr maxAddress = IntPtr.Add(info.lpBaseOfDll, (int)info.SizeOfImage);

            IntPtr currentAddress = startAddress;

            int maxBytePatternLength = _signatures.Values.Max(x => x.Length);

            for (int i = signatureTypes.Count - 1; i >= 0; i--)
            {
                int offset = GetFirstSignatureOccurrence(_signatures[signatureTypes[i]],
                    currentAddress, (int)info.SizeOfImage);

                if (offset > 0)
                {
                    int signature = GetSignaturefromOffset(currentAddress, startAddress, offset);
                    ret.Add(signatureTypes[i], signature);

                    Trace.WriteLine($"Found Signature [{signatureTypes[i]}] at offset [{signature:X8}]", "DEBUG-MACHINA");

                    _ = signatureTypes.Remove(signatureTypes[i]);
                }
            }

            // Missing one or more signatures
            if (signatureTypes.Any())
                for (int i = 0; i < signatureTypes.Count; i++)
                    Trace.WriteLine($"{nameof(SigScan)}.{nameof(Read)}: Missing Signature [{signatureTypes[i]}].", "DEBUG-MACHINA");

            return ret;
        }


        private unsafe int GetFirstSignatureOccurrence(int[] signature, IntPtr Start, int maxLength)
        {

            // loop through each byte in the block and scan for pattern
            for (int i = 0; i < maxLength - signature.Length; i++)
            {
                int numMatch = 0;
                for (int j = 0; j < signature.Length; j++)
                {
                    if (signature[j] == -1)
                        numMatch++; // automatic match
                    else if (signature[j] != ((byte*)Start)[i + j])
                        break;
                    else
                        numMatch++; // byte is equal
                }

                if (numMatch == signature.Length)
                    return i + signature.Length;
            }

            return 0;
        }

        private int GetSignaturefromOffset(IntPtr currentAddress, IntPtr startAddress, int startIndex)
        {
            IntPtr matchAddress;

            // NOTE: 64-bit uses relative instruction pointer (RIP).

            // relative offset is only 32-bits
            matchAddress = (IntPtr)Marshal.ReadInt32(IntPtr.Add(currentAddress, startIndex));

            // add onto current address.
            matchAddress = new IntPtr(currentAddress.ToInt64() + startIndex + sizeof(int) + matchAddress.ToInt64());

            // subtract base address to get relative signature offset
            // note that this assumes the address is sane and will not overflow uint
            int offset = (int)(matchAddress.ToInt64() - startAddress.ToInt64());

            return offset;
        }
        private static int[] SignatureStringToByteArray(string pattern)
        {
            pattern = pattern.Replace(" ", "").Replace("??", "**");

            // convert the pattern into a parseable array
            int[] bytePattern = new int[pattern.Length / 2];
            for (int i = 0; i < (pattern.Length / 2); i++)
            {
                string tmpSearch = pattern.Substring(i * 2, 2);
                bytePattern[i] = tmpSearch == "**" ? -1 : Convert.ToByte(tmpSearch, 16);
            }

            return bytePattern;
        }

    }
}
