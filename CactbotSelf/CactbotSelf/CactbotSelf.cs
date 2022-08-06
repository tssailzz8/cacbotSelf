using Advanced_Combat_Tracker;
using RainbowMage.OverlayPlugin;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CactbotSelf
{
	public class CactbotSelf : IActPluginV1, IOverlayAddonV2
	{
		public string pluginPath = "";
		private static TinyIoCContainer TinyIoCContainer;
		private static Registry Registry;
		private static EventSource EventSource;
		private BackgroundWorker _processSwitcher;
		public static Process FFXIV ;
		FFXIV_ACT_Plugin.FFXIV_ACT_Plugin ffxivPlugin;
		public void DeInitPlugin()
		{
			_processSwitcher.CancelAsync();
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
		}

		public void Init()
		{
			//获取sig
			var window = NativeMethods.FindWindow("FFXIVGAME", null);
			NativeMethods.GetWindowThreadProcessId(window, out var pid);
			var proc = Process.GetProcessById(Convert.ToInt32(pid));
			var gamePath = proc.MainModule?.FileName;
			var oodleNative_Ffxiv = new Offsets(gamePath);
			TinyIoCContainer = Registry.GetContainer();

			Registry = TinyIoCContainer.Resolve<Registry>();
			EventSource = new EventSource(TinyIoCContainer);
			// Register EventSource
			Registry.StartEventSource(EventSource);

		}
		private object GetFfxivPlugin()
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
			pluginStatusText.Text = "Ready.";
			GetFfxivPlugin();
			// We don't need a tab here.
			((TabControl)pluginScreenSpace.Parent).TabPages.Remove(pluginScreenSpace);

			foreach (var plugin in ActGlobals.oFormActMain.ActPlugins)
			{
				if (plugin.pluginObj == this)
				{
					pluginPath = plugin.pluginFile.FullName;
					break;
				}
			}
			//FFXIV = ffxivPlugin.DataRepository.GetCurrentFFXIVProcess()
			//?? Process.GetProcessesByName("ffxiv_dx11").FirstOrDefault();
			_processSwitcher = new BackgroundWorker { WorkerSupportsCancellation = true };
			_processSwitcher.DoWork += ProcessSwitcher;
			_processSwitcher.RunWorkerAsync();
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

				if (FFXIV != GetFFXIVProcess())
				{
					FFXIV = GetFFXIVProcess();
					if (FFXIV != null)
						if (FFXIV.ProcessName == "ffxiv")
							return;
						else Init();
				}

				Thread.Sleep(3000);
			}
		}
		private Process GetFFXIVProcess()
		{
			return ffxivPlugin.DataRepository.GetCurrentFFXIVProcess();
		}
	}
}
