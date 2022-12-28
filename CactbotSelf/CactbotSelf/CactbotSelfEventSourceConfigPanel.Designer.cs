using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace CactbotSelf
{
	partial class CactbotSelfEventSourceConfigPanel
	{
		/// <summary> 
		/// 必要なデザイナー変数です。
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary> 
		/// 使用中のリソースをすべてクリーンアップします。
		/// </summary>
		/// <param name="disposing">マネージド リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region コンポーネント デザイナーで生成されたコード

		/// <summary> 
		/// デザイナー サポートに必要なメソッドです。このメソッドの内容を 
		/// コード エディターで変更しないでください。
		/// </summary>
		private void InitializeComponent()
		{
			this.职业顺序 = new System.Windows.Forms.Label();
			this.checkBox1 = new System.Windows.Forms.CheckBox();
			this.button1 = new System.Windows.Forms.Button();
			this.button2 = new System.Windows.Forms.Button();
			this.listView1 = new System.Windows.Forms.ListView();
			this.button3 = new System.Windows.Forms.Button();
			this.SuspendLayout();
			// 
			// 职业顺序
			// 
			this.职业顺序.AutoSize = true;
			this.职业顺序.Location = new System.Drawing.Point(-3, 43);
			this.职业顺序.Name = "职业顺序";
			this.职业顺序.Size = new System.Drawing.Size(67, 15);
			this.职业顺序.TabIndex = 0;
			this.职业顺序.Text = "职业顺序";
			// 
			// checkBox1
			// 
			this.checkBox1.AutoSize = true;
			this.checkBox1.Location = new System.Drawing.Point(0, 5);
			this.checkBox1.Name = "checkBox1";
			this.checkBox1.Size = new System.Drawing.Size(104, 19);
			this.checkBox1.TabIndex = 2;
			this.checkBox1.Text = "使用鲶鱼精";
			this.checkBox1.UseVisualStyleBackColor = true;
			checkBox1.Checked= config.open;
			this.checkBox1.CheckedChanged += new System.EventHandler(this.checkBox1_CheckedChanged);
			// 
			// button1
			// 
			this.button1.Location = new System.Drawing.Point(160, 113);
			this.button1.Name = "button1";
			this.button1.Size = new System.Drawing.Size(42, 31);
			this.button1.TabIndex = 3;
			this.button1.Text = "↑";
			this.button1.UseVisualStyleBackColor = true;
			this.button1.Click += new System.EventHandler(this.button1_Click);
			// 
			// button2
			// 
			this.button2.Location = new System.Drawing.Point(160, 180);
			this.button2.Name = "button2";
			this.button2.Size = new System.Drawing.Size(42, 31);
			this.button2.TabIndex = 4;
			this.button2.Text = "↓";
			this.button2.UseVisualStyleBackColor = true;
			this.button2.Click += new System.EventHandler(this.button1_Click2);
			// 
			// listView1
			// 
			this.listView1.FullRowSelect = true;
			this.listView1.HideSelection = false;
			this.listView1.Location = new System.Drawing.Point(70, 30);
			this.listView1.Name = "listView1";
			this.listView1.Size = new System.Drawing.Size(84, 279);
			this.listView1.TabIndex = 1;
			this.listView1.TileSize = new System.Drawing.Size(168, 10);
			this.listView1.UseCompatibleStateImageBehavior = false;
			this.listView1.View = System.Windows.Forms.View.SmallIcon;
			this.listView1.SelectedIndexChanged += new System.EventHandler(this.listView1_SelectedIndexChanged);
			for (int i = 0; i < config.shunxu.Count; i++)
			{
				listView1.Items.Add($@"[{i}]{config.shunxu[i]}");
			}
			// 
			// button3
			// 
			this.button3.Location = new System.Drawing.Point(-11, 113);
			this.button3.Name = "button3";
			this.button3.Size = new System.Drawing.Size(75, 23);
			this.button3.TabIndex = 5;
			this.button3.Text = "初始化";
			this.button3.UseVisualStyleBackColor = true;
			this.button3.Click += new System.EventHandler(this.button3_Click);
			// 
			// CactbotSelfEventSourceConfigPanel
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.Controls.Add(this.button3);
			this.Controls.Add(this.button2);
			this.Controls.Add(this.button1);
			this.Controls.Add(this.checkBox1);
			this.Controls.Add(this.listView1);
			this.Controls.Add(this.职业顺序);
			this.Margin = new System.Windows.Forms.Padding(4);
			this.Name = "CactbotSelfEventSourceConfigPanel";
			this.Size = new System.Drawing.Size(333, 312);
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private System.Windows.Forms.Label 职业顺序;
		private System.Windows.Forms.CheckBox checkBox1;
		private System.Windows.Forms.Button button1;
		private System.Windows.Forms.Button button2;
		private ListView listView1;
		private Button button3;
	}
}
