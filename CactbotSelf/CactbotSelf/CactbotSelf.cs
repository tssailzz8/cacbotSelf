using Advanced_Combat_Tracker;
using FFXIV_ACT_Plugin.Memory.MemoryReader;
using FFXIV_ACT_Plugin.Memory;
using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Diagnostics.Tracing;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.MinIoC;

namespace CactbotSelf
{
	public class CactbotSelf : UserControl,IActPluginV1, IOverlayAddonV2
	{
		public string pluginPath = "";
		private static TinyIoCContainer TinyIoCContainer;
		private static Registry Registry;
		private static EventSource EventSource;
		private BackgroundWorker _processSwitcher;
		public static Process FFXIV ;
        public static FFXIV_ACT_Plugin.FFXIV_ACT_Plugin ffxivPlugin;
		public static MainClass mainClass;
		public TabPage tabPagetabPagetabPage;
		public Label labe;
        public static MoreLogLineUI PluginUI;
        public void DeInitPlugin()
		{
			//mainClass.DeInitPlugin();
			foreach (var item in Registry.EventSources)
			{
				if (item.Name == "CactbotSelf" && item != null)
				{
					item.Dispose();
				}

			}
			Type type = typeof(Registry);
			FieldInfo fieldInfo = type.GetField("_eventSources", BindingFlags.Instance | BindingFlags.NonPublic);
			((List<IEventSource>)fieldInfo.GetValue(Registry)).Remove(EventSource);
			if (System.IO.File.Exists(Offsets._tempfilename))
			{
				System.IO.File.Delete(Offsets._tempfilename);
			}


		}

		public void Init()
		{
			//if (TinyIoCContainer is not null)
			//{
			//	return;
			//}
			//获取sig
            var window = NativeMethods.FindWindow("FFXIVGAME", null);
			NativeMethods.GetWindowThreadProcessId(window, out var pid);
			var proc = Process.GetProcessById(Convert.ToInt32(pid));
            TinyIoCContainer = Registry.GetContainer();
           
            Registry = TinyIoCContainer.Resolve<Registry>();
            var gamePath = proc.MainModule?.FileName;

            var oodleNative_Ffxiv = new Offsets(gamePath);
			
			oodleNative_Ffxiv.findNetDown();
			oodleNative_Ffxiv.UnInitialize();
			//CactbotSelf.mainClass.InitPlugin(PluginUI);
			//mainClass = new MainClass();
			//CactbotSelf.mainClass.InitPlugin(PluginUI);
			//var container = Registry.GetContainer();
			//var registry = container.Resolve<Registry>();
			//var eventSource = (EventSource)registry.EventSources.FirstOrDefault(p => p.Name == "CactbotSelf");
			//if (eventSource == null)
			//{
			//	eventSource = new EventSource(container);
			//	registry.StartEventSource(eventSource);
			//}

		}
		public   object GetFfxivPlugin()
		{
			ffxivPlugin = null;

			if (ffxivPlugin == null)
			{
				IActPluginV1 actPluginV = (from x in ActGlobals.oFormActMain.ActPlugins
										   where x.pluginFile.Name.ToUpper().Contains("FFXIV_ACT_Plugin".ToUpper())
										   select x.pluginObj).FirstOrDefault<IActPluginV1>();
				ffxivPlugin = (FFXIV_ACT_Plugin.FFXIV_ACT_Plugin)actPluginV;
			}
			return ffxivPlugin;
		}

		public void InitPlugin(TabPage pluginScreenSpace, Label pluginStatusText)
		{
			pluginStatusText.Text = "Ready";
            GetFfxivPlugin();
			// We don't need a tab here.
			pluginScreenSpace.Text = "MoreLogLine";
            tabPagetabPagetabPage = pluginScreenSpace;
			labe = pluginStatusText;
            PluginUI = new MoreLogLineUI();
			//pluginScreenSpace.Controls.Add(PluginUI);
			PluginUI.InitializeComponent(pluginScreenSpace);
			foreach (var plugin in ActGlobals.oFormActMain.ActPlugins)
			{
				if (plugin.pluginObj == this)
				{
					pluginPath = plugin.pluginFile.FullName;
					break;
				}
			}
			TinyIoCContainer = Registry.GetContainer();;
			Registry = TinyIoCContainer.Resolve<Registry>();
			mainClass = new();
			if (EventSource == null)
			{
				EventSource = new EventSource(TinyIoCContainer);
				Registry.StartEventSource(EventSource);
			}
			//FFXIV = ffxivPlugin.DataRepository.GetCurrentFFXIVProcess()
			//?? Process.GetProcessesByName("ffxiv_dx11").FirstOrDefault();
			//之前办法
			//         _processSwitcher = new BackgroundWorker { WorkerSupportsCancellation = true };
			//_processSwitcher.DoWork += ProcessSwitcher;
			//_processSwitcher.RunWorkerAsync();


			//Init();
		}
		/// <summary>
        ///     代替ProcessChanged委托，手动循环检测当前活动进程并进行注入。
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>

		private void ProcessSwitcher(object sender, DoWorkEventArgs e)
		{
			while (true)
			{
				if (_processSwitcher.CancellationPending)
				{
					e.Cancel = true;
					break;
				}
				FFXIV = GetFFXIVProcess();
				if (FFXIV != null)
				{
					Init();
					return;
				}
				//if (FFXIV != GetFFXIVProcess())
				//{
				//	FFXIV = GetFFXIVProcess();
				//	if (FFXIV is not null)
				//		if (FFXIV.ProcessName == "ffxiv")
				//			MessageBox.Show("错误：游戏运行于DX9模式下") ;
				//		else Init();
				//}

				Thread.Sleep(3000);
			}
		}
		private Process GetFFXIVProcess()
		{
			return ffxivPlugin.DataRepository.GetCurrentFFXIVProcess();
		}

	}
}
