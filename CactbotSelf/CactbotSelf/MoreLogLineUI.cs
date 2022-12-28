using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Text;
using System.Windows.Forms;
using System.IO;
using System.Reflection;
using System.Xml;
using System.Linq;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin;
using FFXIV_ACT_Plugin.Common;


namespace CactbotSelf
{
    public class MoreLogLineUI : UserControl
    {

        private GroupBox _mainGroupBox;
        private Label _lbPort;  //端口：
        public NumericUpDown TextPort; //端口
        public Button ButtonStart { get; private set; }
        public Button ButtonStop { get; private set; }
        private CheckBox StarCast;
        private CheckBox StarMove;
        private CheckBox StartSet;
        public bool startCast => StarCast.Checked;
        public bool startMove => StarMove.Checked;
        public bool starSet => StartSet.Checked;
        private static readonly string SettingsFile = Path.Combine(ActGlobals.oFormActMain.AppDataFolder.FullName, "Config\\MoreLog.config.xml");

        private static ListBox lstMessages;
        private static Button cmdClearMessages;
        private static Button cmdCopyProblematic;

        public void InitializeComponent(TabPage pluginScreenSpace)
        {
            _mainGroupBox = new GroupBox { Location = new Point(12, 12), Text = "监听设置", AutoSize = true, AutoSizeMode = AutoSizeMode.GrowAndShrink };
            TextPort = new NumericUpDown { Location = new Point(85, 50), DecimalPlaces = 0, Maximum = 65535, Value = 2019, Size = new Size(100, 35) };

            StarCast = new CheckBox { AutoSize = true, Text = "开启监控ACtorCast", Location = new Point(10, 33) };
            //StarMove = new CheckBox { AutoSize = true, Text = "开启监控ACtorMove", Location = new Point(150, 33) };
            StarMove = new CheckBox { AutoSize = true, Text = "开启监控ACtorMove", Location = new Point(StarCast.Location.X + StarCast.Width + 100, 33) };
            StartSet = new CheckBox { AutoSize = true, Text = "开启监控ACtorSet", Location = new Point(StarMove.Location.X + StarMove.Width + 100, 33) };

            lstMessages = new ListBox { Location = new Point(10, TextPort.Height * 2 + 20), FormattingEnabled = true, ScrollAlwaysVisible = true, HorizontalScrollbar = true, Size = new Size(440, 500), };
            cmdClearMessages = new Button { Location = new Point(10, lstMessages.Location.Y + lstMessages.Height + 10), Size = new Size(200, TextPort.Height), Text = "清空日志", UseVisualStyleBackColor = true };
            cmdCopyProblematic = new Button { Location = new Point(220, lstMessages.Location.Y + lstMessages.Height + 10), Size = new Size(200, TextPort.Height), Text = "复制到剪贴板", UseVisualStyleBackColor = true };

            LoadSettings();
            _mainGroupBox.Controls.Add(_lbPort);

            _mainGroupBox.Controls.Add(ButtonStart);
            _mainGroupBox.Controls.Add(ButtonStop);
            _mainGroupBox.Controls.Add(StarCast);
            _mainGroupBox.Controls.Add(StarMove);
            _mainGroupBox.Controls.Add(StartSet);
            _mainGroupBox.Controls.Add(lstMessages);
            _mainGroupBox.Controls.Add(cmdClearMessages);
            _mainGroupBox.Controls.Add(cmdCopyProblematic);


            pluginScreenSpace.Controls.Add(_mainGroupBox);
            pluginScreenSpace.AutoSize = true;

            cmdCopyProblematic.Click += cmdCopyProblematic_Click;
            cmdClearMessages.Click += cmdClearMessages_Click;

            _mainGroupBox.ResumeLayout(false);
            _mainGroupBox.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        public void cmdCopyProblematic_Click(object sender, EventArgs e)
        {
            StringBuilder stringBuilder = new StringBuilder();
            foreach (object item in lstMessages.Items)
            {
                stringBuilder.AppendLine((item ?? "").ToString());
            }
            if (stringBuilder.Length > 0)
            {
                Clipboard.SetText(stringBuilder.ToString());
            }
        }

        public void cmdClearMessages_Click(object sender, EventArgs e)
        {
            lstMessages.Items.Clear();
        }

        public void Log(string message)
        {

            //FFXIV_ACT_Plugin.Common.ACTWrapper.RunOnACTUIThread((System.Action)delegate
            //{
            //    lstMessages.Items.Add(message);
            //});
            ActGlobals.oFormActMain.SafeInvoke(new Action(() =>
            {

                lstMessages.Items.Add(message);

            }));


        }
        public void RunOnACTUIThread(Action code)
        {
            if (!ActGlobals.oFormActMain.InvokeRequired)
            {
                code();
                return;
            }
            if (ActGlobals.oFormActMain.IsDisposed || ActGlobals.oFormActMain.Disposing)
            {
                return;
            }
        }


        void LoadSettings()
        {

            if (File.Exists(SettingsFile))
            {
                XmlDocument xdo = new XmlDocument();
                try
                {
                    xdo.Load(SettingsFile);
                    XmlNode head = xdo.SelectSingleNode("Config");
                    TextPort.Text = head?.SelectSingleNode("Port")?.InnerText;
                    StarMove.Checked = bool.Parse(head?.SelectSingleNode("StarMove")?.InnerText ?? "false");
                    StarCast.Checked = bool.Parse(head?.SelectSingleNode("StarCast")?.InnerText ?? "false");
                    StartSet.Checked = bool.Parse(head?.SelectSingleNode("StartSet")?.InnerText ?? "false");
                }
                catch (Exception ex)
                {
                    Log("配置文件载入异常");
                    File.Delete(SettingsFile);
                    Log("已清除错误的配置文件");
                    Log("设置已被重置");
                }

            }
        }
        public void SaveSettings()
        {
            FileStream fs = new FileStream(SettingsFile, FileMode.Create, FileAccess.Write, FileShare.ReadWrite);
            XmlTextWriter xWriter = new XmlTextWriter(fs, Encoding.UTF8) { Formatting = Formatting.Indented, Indentation = 1, IndentChar = '\t' };
            xWriter.WriteStartDocument(true);
            xWriter.WriteStartElement("Config");    // <Config>
            xWriter.WriteElementString("StarMove", StarMove.Checked.ToString());
            xWriter.WriteElementString("StarCast", StarCast.Checked.ToString());
            xWriter.WriteElementString("StartSet", StartSet.Checked.ToString());
            xWriter.WriteEndElement();  // </Config>
            xWriter.WriteEndDocument(); // Tie up loose ends (shouldn't be any)
            xWriter.Flush();    // Flush the file buffer to disk
            xWriter.Close();
        }
    }
    public static class SafeThreadInvoker
    {
        public static object SafeInvoke(this Control control, Delegate method)
        {
            var asyncResult = control.BeginInvoke(method);

            return SafeWait(control, asyncResult);
        }

        public static object SafeInvoke(this Control control, Delegate method, object[] args)
        {
            var asyncResult = control.BeginInvoke(method, args);

            return SafeWait(control, asyncResult);
        }

        private static object SafeWait(Control control, IAsyncResult result)
        {
            if (result.CompletedSynchronously)
            {
                return control.EndInvoke(result);
            }

            for (var i = 0; i < 50; i++)
            {
                if (control.IsDisposed || control.Disposing || !control.IsHandleCreated)
                {
                    break;
                }

                result.AsyncWaitHandle.WaitOne(100);
                if (result.IsCompleted)
                {
                    return control.EndInvoke(result);
                }
            }

            return null;
        }

        public static void AppendDateTimeLine(this RichTextBox target, string text)
        {
            if (target.InvokeRequired)
            {
                target.SafeInvoke(new Action(delegate
                {
                    target.AppendDateTimeLine(text);
                }));
            }
            else
            {
                target.AppendText($"\n[{DateTime.Now.ToLongTimeString()}] {text}");
                target.ScrollToCaret();
            }
        }
    }
}