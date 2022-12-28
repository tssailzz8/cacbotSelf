using System;
using System.Collections.Generic;
using System.Windows.Forms;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace CactbotSelf
{
	public partial class CactbotSelfEventSourceConfigPanel : UserControl
	{
		private CactbotSelfEventSourceConfig config;
		private EventSource source;
		

		public	CactbotSelfEventSourceConfigPanel(EventSource source)
		{

			this.source = source;
			this.config = source.Config;
			InitializeComponent();


			SetupConfigEventHandlers();
		}



		private void SetupConfigEventHandlers()
		{
		}

		private void InvokeIfRequired(Action action)
		{
			if (this.InvokeRequired)
			{
				this.Invoke(action);
			}
			else
			{
				action();
			}
		}


		private void AddonExampleEventSourceConfigPanel_Load(object sender, EventArgs e)
		{

		}


		private void button1_Click(object sender, EventArgs e)
		{
			if (listView1.SelectedIndices != null && listView1.SelectedIndices.Count > 0)
			{
				var c = listView1.SelectedIndices;
				var b = listView1.Items[c[0]].Text;
				var 选中的 = c[0];
				if (选中的>=1)
				{
					listView1.BeginUpdate();
					var 交换 = config.shunxu[选中的];
					config.shunxu[选中的] = config.shunxu[选中的 - 1];
					config.shunxu[选中的 - 1] = 交换;
					listView1.Items.Clear();
					for (int i = 0; i < config.shunxu.Count; i++)
					{
						listView1.Items.Add($@"[{i}]{config.shunxu[i]}");
					}
					listView1.EndUpdate();
					listView1.Focus();
					listView1.Items[选中的 - 1].Focused = true;
					listView1.Items[选中的 - 1].Selected = true;
				}
				

			}
		}
		private void button1_Click2(object sender, EventArgs e)
		{
			if (listView1.SelectedIndices != null && listView1.SelectedIndices.Count > 0)
			{
				var c = listView1.SelectedIndices;
				var b = listView1.Items[c[0]].Text;
				var 选中的 = c[0];
				if (选中的 <= config.shunxu.Count-1)
				{
					listView1.BeginUpdate();
					var 交换 = config.shunxu[选中的];
					config.shunxu[选中的] = config.shunxu[选中的 + 1];
					config.shunxu[选中的 + 1] = 交换;
					listView1.Items.Clear();
					for (int i = 0; i < config.shunxu.Count; i++)
					{
						listView1.Items.Add($@"[{i}]{config.shunxu[i]}");
					}
					listView1.EndUpdate();
					listView1.Focus();
					listView1.Items[选中的 + 1].Focused = true;
					listView1.Items[选中的 + 1].Selected = true;
				}

			}
		}

		private void listView1_SelectedIndexChanged(object sender, EventArgs e)
		{

		}

		private void checkBox1_CheckedChanged(object sender, EventArgs e)
		{
			config.open = checkBox1.Checked;
		}

		private void button3_Click(object sender, EventArgs e)
		{
			var shunxu2 = new List<string> { "黑骑", "枪刃", "战士", "骑士", "白魔", "占星", "贤者", "学者", "武士", "武僧", "镰刀", "龙骑", "忍者", "机工", "舞者", "诗人", "黑魔", "召唤", "赤魔" };
			config.shunxu = shunxu2;
			listView1.Items.Clear();
			for (int i = 0; i < config.shunxu.Count; i++)
			{
				listView1.Items.Add($@"[{i}]{config.shunxu[i]}");
			}
		}
	}
}
