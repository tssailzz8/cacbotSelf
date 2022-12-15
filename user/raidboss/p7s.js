let shunxu = [{
  'job': '白魔',
  'order': 5
},
{
  'job': '占星',
  'order': 6
},
{
  'job': '贤者',
  'order': 7
},
{
  'job': '学者',
  'order': 8
},
{
  'job': '战士',
  'order': 3
},
{
  'job': '槍刃',
  'order': 2
},
{
  'job': '黑骑',
  'order': 1
},
{
  'job': '骑士',
  'order': 4
},
{
  'job': '武士',
  'order': 9
},
{
  'job': '武僧',
  'order': 10
},
{
  'job': '錬刀',
  'order': 11
},
{
  'job': '龙骑',
  'order': 13
},
{
  'job': '忍者',
  'order': 12
},
{
  'job': '黑魔',
  'order': 14
},
{
  'job': '诗人',
  'order': 15
},
{
  'job': '舞者',
  'order': 16
},
{
  'job': '机工',
  'order': 17
},
{
  'job': '召唤',
  'order': 18
},
{
  'job': '赤魔',
  'order': 19
},
];
function nametocnjob(name, data) {
  let re;
  switch (data.party.jobName(name)) {
    case 'PLD':
      re = '骑士';
      break;
    case 'MNK':
      re = '武僧';
      break;
    case 'WAR':
      re = '战士';
      break;
    case 'DRG':
      re = '龙骑';
      break;
    case 'BRD':
      re = '诗人';
      break;
    case 'WHM':
      re = '白魔';
      break;
    case 'BLM':
      re = '黑魔';
      break;
    case 'SMN':
      re = '召唤';
      break;
    case 'SCH':
      re = '学者';
      break;
    case 'NIN':
      re = '忍者';
      break;
    case 'MCH':
      re = '机工';
      break;
    case 'DRK':
      re = '黑骑';
      break;
    case 'AST':
      re = '占星';
      break;
    case 'SAM':
      re = '武士';
      break;
    case 'RDM':
      re = '赤魔';
      break;
    case 'GNB':
      re = '槍刃';
      break;
    case 'DNC':
      re = '舞者';
      break;
    case 'RPR':
      re = '錬刀';
      break;
    case 'SGE':
      re = '贤者';
      break;
    case 'BLU':
      re = '青魔';
      break;
    default:
      re = name;
      break;
  };
  // 如果有重复职业，则播报职业+ID
  // t同职业
  if (data.party.roleToPartyNames_.tank[0] == data.party.roleToPartyNames_.tank[1]) {
    return re + ' ' + data.ShortName(name);
  };
  // H同职业
  if (data.party.roleToPartyNames_.healer[0] == data.party.roleToPartyNames_.healer[1]) {
    return re + ' ' + data.ShortName(name);
  };
  // DPS同职业
  for (let i = 0; i < 3; i++) {
    for (let a = 1; a < 4; a++) {
      if (i == a) {
        continue;
      };
      if (data.party.roleToPartyNames_.dps[i] == data.party.roleToPartyNames_.dps[a]) {
        return re + ' ' + data.ShortName(name);
      };
    };
  };
  // 没有同职业，播报职业
  return re;
};
Options.Triggers.push({
  zoneId: 1086,
  overrideTimelineFile: true,
  timelineFile: "P7S.txt",
  initData: () => ({
    四连: false,
    四连顺序: ['', '', '', ''],
    四连播报: ['', '', '', ''],
    四连分摊位置: '',
    四连分散位置: ['', ''],
    召唤次数: 0,

  }),
  timelineTriggers: [
    // {
    //   id: '四连播报2',
    //   regex: /播报2/,
    //   durationSeconds: 7,
    //   alertText: (data) => {
    //     if (data.四连播报[1] == '分摊')
    //       return '去场中抬血后 , ' + data.四连分摊位置 + data.四连播报[1];
    //     return '去场中抬血后 ' + data.四连分散位置[1] + data.四连播报[1];
    //   },
    // },
    // {
    //   id: '四连播报3',
    //   regex: /播报3/,
    //   durationSeconds: 7,
    //   alertText: (data) => {
    //     if (data.四连播报[2] == '分摊')
    //       return '去场中抬血后 , ' + data.四连分摊位置 + data.四连播报[2];
    //     return '去场中抬血后 ' + data.四连分散位置[0] + data.四连播报[2];
    //   },
    // },
    // {
    //   id: '四连播报4',
    //   regex: /播报4/,
    //   durationSeconds: 7,
    //   suppressSeconds: 10,
    //   alertText: (data) => {
    //     data.四连 = false;
    //     if (data.四连播报[3] == '分摊')
    //       return '去场中抬血后 , ' + data.四连分摊位置 + data.四连播报[3];
    //     return '去场中抬血后 ' + data.四连分散位置[1] + data.四连播报[3];
    //   },
    // },
    {
      id: '四连AOE',
      regex: /生命的极光 AOE/,
      beforeSeconds: 10,
      alertText: '超大AOE',
    },
  ],
  triggers: [
    {
      id: 'P7S Condensed Aero II',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7836' }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: '分摊死刑',
      },
    },
    {
      id: 'P7S Dispersed Aero II',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7835' }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: '分散死刑',
      },
    },
    {
      id: 'P7S地火次数',
      type: 'StartsUsing',
      suppressSeconds: 2,
      netRegex: NetRegexes.startsUsing({ id: '782F' }),
      suppressSeconds: 10,
      delaySeconds: 3,
      alertText: (data, matches, output) => {
        delete data.地火;
        if (!data.击退) data.击退 = 1;
        else data.击退++;
      }
    },
    {
      id: 'P7S召唤',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['7810', '7A4F', '7A50', '7A51'] }),
      suppressSeconds: 10,
      run: (data, matches, output) => {
        data.鸟蛋 = [];
        data.钢铁兽 = [];
        data.连线兽 = [];
        data.召唤次数++;
      }
    },
    //   {
    //     id: 'P7S第一次召唤',
    //     type: 'StartsUsing',
    //     netRegex: NetRegexes.startsUsing({ id: '7810'}),
    //     delaySeconds:12,
    //     promise: async (data,matches) => {
    //         const boss = await callOverlayHandler({
    //             call: 'getCombatants',
    //         });
    //         let boosData=boss.combatants.filter(i=>i.ID==parseInt('400110Fe', 16));
    //         //let boosData=boss.combatants.filter(i=>i.BNpcID==14895&&i.BNpcNameID==11376);
    //         console.log(boosData);

    //     },
    //     alertText: (data, matches, output) => {
    //         return '123'
    //     }
    // },
    {
      id: '蛋属性收集',
      netRegex: /] ChatLog 00:0:106:(?<sourceID>(?:[^:]*)):(?<sourceName>(?:[^:]*)):0197:.{4}:000011D1:/,
      promise: async (data, matches) => {
        debugger;
        const boss1 = await callOverlayHandler({
          call: 'getCombatants',
        });
        const boss = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceID, 16)],
        });

        if (boss) {
          let bossData = boss.combatants[0];
          if (bossData.BNpcID == 14895 && bossData.BNpcNameID == 11376) data.鸟蛋.push(bossData);
          if (bossData.BNpcID == 14894 && bossData.BNpcNameID == 11375) data.钢铁兽.push(bossData);
          if (bossData.BNpcID == 14896 && bossData.BNpcNameID == 11377) data.连线兽.push(bossData);
        }

      },

    },
    {
      id: '蛋属性播报',
      netRegex: /] ChatLog 00:0:106:(?<sourceID>(?:[^:]*)):(?<sourceName>(?:[^:]*)):0197:.{4}:000011D1:/,
      suppressSeconds: 10,
      delaySeconds: 0.5,
      alertText: (data, matches, output) => {
        data.绳子 = [];
        if (data.召唤次数 == 1) {
          if (data.钢铁兽[0].PosX > 100) return '去左边'
          else return '去右边'
        }
        if (data.召唤次数 == 4) {
          data.方位 = Math.round(4 - 4 * Math.atan2(data.钢铁兽[0].PosX - 100, data.钢铁兽[0].PosY - 100) / Math.PI) % 8;
          if (data.方位 == 7) return '朝右引导'
          if (data.方位 == 1) return '朝左引导'
          if (data.方位 == 4) return '朝上引导'
        }
        if (data.召唤次数 == 6) {
          data.方位 = Math.round(4 - 4 * Math.atan2(data.钢铁兽[0].PosX - 100, data.钢铁兽[0].PosY - 100) / Math.PI) % 8;
          if (data.方位 == 7) data.四连第一次放置 = '右上'
          if (data.方位 == 1) data.四连第一次放置 = '左上'
          if (data.方位 == 4) data.四连第一次放置 = '左上'
          return '去' + data.四连第一次放置;
        }
        if (data.召唤次数 == 8) {
          let 位置 = ['左上', '右上', '下'];
          let 方位 = Math.round(4 - 4 * Math.atan2(data.鸟蛋[0].PosX - 100, data.鸟蛋[0].PosY - 100) / Math.PI) % 8;
          let 方位1 = Math.round(4 - 4 * Math.atan2(data.鸟蛋[1].PosX - 100, data.鸟蛋[1].PosY - 100) / Math.PI) % 8;
          if (方位 == 7||方位1==7) delete 位置[0];
          if (方位 == 1||方位1==1) delete 位置[1];
          if (方位 == 4||方位1==4) delete 位置[2];
          data.运动会 = 位置.filter(s => s && s.trim())[0];
          return '先去' + data.运动会;
        };
        if (data.召唤次数 == 10) {
        }

      },
    },
    {
      id: '绳子',
      type: 'Tether',
      condition: (data, matches) => data.召唤次数 == 4,
      netRegex: NetRegexes.tether({ id: ['0001', '0006', '0039', '0011'] }),
      delaySeconds: 0.3,
      preRun: (data, matches) => data.绳子.push(matches.target),
      promise: async (data, matches) => {
        const boss = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        if (boss.combatants&&matches.target==data.me) {

          let bossData = boss.combatants[0];
          console.log(bossData);
          data.连线 = bossData;
        }

      },
      alertText: (data, matches, output) => {
        if (data.绳子.length == 6) {
         
          data.绳子.push(1);
          if (!data.绳子.includes(data.me)) {
            if (data.方位 == 7) return '朝右引导'
            if (data.方位 == 1) return '朝左引导'
            if (data.方位 == 4) return '朝上引导'

          }
          else {
            let 位置 = ['去左上', '去右上', '去下'];
            let 方位 = Math.round(4 - 4 * Math.atan2(data.连线.PosX - 100, data.连线.PosY - 100) / Math.PI) % 8;
            if (matches.id === '0001' || matches.id === '0039')
             {
              if (方位 == 7) return 位置[0];
              if (方位 == 1) return 位置[1];
              if (方位 == 4) return 位置[2];
            }
            if (matches.id === '0006') {
              if (data.方位 == 7) delete 位置[0];
              if (data.方位 == 1) delete 位置[1];
              if (data.方位 == 4) delete 位置[2];

              if (方位 == 7) delete 位置[0];
              if (方位 == 1) delete 位置[1];
              if (方位 == 4) delete 位置[2];
              位置 = 位置.filter(s => s && s.trim());

              return 位置[0];
            }
          }
        }
      }
    },
    {
      id: '三连运动会第一次',
      type: 'Tether',
      condition: (data, matches) => data.召唤次数 == 8,
      netRegex: NetRegexes.tether({ id: ['0001', '0006', '0039', '0011'] }),
      delaySeconds: 0.1,
      preRun: (data, matches) => data.绳子.push(matches.target),
      promise: async (data, matches) => {
        const boss = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        if (boss.combatants&&matches.target==data.me) {
          let bossData = boss.combatants[0];
         data.连线 = bossData;

        }

      },
      alertText: (data, matches, output) => {
        if (data.绳子.length == 4) {

          if (!data.绳子.includes(data.me)) {
            return '先去' + data.运动会 + '引导';
          }
          else {
            let 位置 = ['左上', '右上', '下'];

            let 方位 = Math.round(4 - 4 * Math.atan2(data.连线.PosX - 100, data.连线.PosY - 100) / Math.PI) % 8;
            if (matches.id === '0001' || matches.id === '0039') {

              if (方位 == 7) delete 位置[0];
              if (方位 == 1) delete 位置[1];
              if (方位 == 4) delete 位置[2];
              位置 = 位置.filter(s => s && s.trim());
              let 剩下的位置 = 位置.filter((i) => i !== data.运动会);

              return '拉向' + 剩下的位置[0];
            }
          }
        }

      }
    },
    {
      id: '三连运动会第二次',
      type: 'Tether',
      condition: (data, matches) => data.召唤次数 == 9 &&matches.target==data.me,
      netRegex: NetRegexes.tether({ id: ['0001', '0006', '0039', '0011'] }),
      promise: async (data, matches) => {
        const boss = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        data.绳子.push(matches.target);
        if (boss.combatants&&matches.target==data.me) {
          let bossData = boss.combatants[0];
           data.连线 = bossData;

        }

      },
      alertText: (data, matches, output) => {

          //桥上2个的距离小于10 方位分别是0,3,5
          let 钢铁兽 = data.钢铁兽.find((i) => Math.hypot(i.PosX - 100, i.PosY - 100) > 10);
          let 钢铁兽方位 = Math.round(4 - 4 * Math.atan2(钢铁兽.PosX - 100, 钢铁兽.PosY - 100) / Math.PI) % 8;
          let 钢铁兽位置 = '';
          if (钢铁兽方位 == 7) 钢铁兽位置 = '左上';
          if (钢铁兽方位 == 1) 钢铁兽位置 = '右上';
          if (钢铁兽方位 == 4) 钢铁兽位置 = '下';
          if (data.role == 'tank') return '去' + 钢铁兽位置 + '无敌'
          else {

            if (data.partJob === undefined) data.partJob = [];
            for (let i = 0; i < 8; i++) {
              let job = nametocnjob(data.party.idToName_[data.party.partyIds_[i]], data);
              data.partJob.push(job);
            }
            data.partJob.sort((a, b) => {
              return shunxu.find((c) => c.job == a).order - shunxu.find((c) => c.job == b).order
            });
            let job = nametocnjob(data.me, data);
            let 我的顺序 = data.partJob.indexOf(nametocnjob(data.me, data));
            let mt = false;
            let bobao = ['左上', '右上', '下'];
            let bobao1 = bobao.filter((i) => i != 钢铁兽位置);
            if (我的顺序 % 2 == 0) mt = true;
            if (我的顺序 % 2 == 1) mt = false;
            if (mt) return '去' + bobao1[1] + '拉线'
            else return '去' + bobao1[0] + '拉线'
        }

      }
    },
    //运动会第三次
    //P7S Forbidden Fruit 4 and Harvest Tethers
    {
      id: 'P7S Forbidden Fruit 4 and Harvest Tethers',
      type: 'Tether',
      condition: (data, matches) => data.召唤次数 == 10 &&matches.target==data.me,
      netRegex: NetRegexes.tether({ id: ['0001', '0006', '0039', '0011'] }),
      promise: async (data, matches) => {
        const boss = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        if (boss.combatants&&matches.target==data.me) {
          let bossData = boss.combatants[0];
          data.连线 = bossData;
        }
      },
      alertText: (data, matches, output) => {
        let 钢铁兽方位 = Math.round(4 - 4 * Math.atan2(data.钢铁兽[0].PosX - 100, data.钢铁兽[0].PosY - 100) / Math.PI) % 8;
        let bobao = ['上', '右上', '右', '右下', '下', '左下', '左', '左上角'];
        if (matches.id === '0006') {
          return '去' + bobao[钢铁兽方位] + '引导连线'
        }

        let 离得近的远离牛 = data.连线兽.find((i) => Math.hypot(data.钢铁兽[0].PosX - i.PosX, data.钢铁兽[0].PosY - i.PosX));
        let 离得近的远离牛方位 = Math.round(4 - 4 * Math.atan2(离得近的远离牛.PosX - 100, 离得近的远离牛.PosY - 100) / Math.PI) % 8;
        let 顺逆判断 = 离得近的远离牛方位 - 钢铁兽方位;
        let 方位 = Math.round(4 - 4 * Math.atan2(data.连线.PosX - 100, data.连线.PosY - 100) / Math.PI) % 8;
        if (matches.id === '0006') {
          return '去' + bobao[钢铁兽方位] + '引导连线'
        }
        if (matches.id === '0011') {
          return '去' + bobao[方位] + '引导连线'
        }
        else {
          let 顺逆 = '';
          if (顺逆判断 > 0 || 顺逆判断 == -5) 顺逆 = '顺时针'
          else 顺逆 = '逆时针'
          if (顺逆 == '顺时针') return '去' + bobao[方位 + 1] + '引导连线'
          if (顺逆 == '逆时针') return '去' + bobao[(方位 + 8 - 1) & 8] + '引导连线'

        }

      }
    },
    {
      id: 'P7S地火',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '782F' }),
      condition: (data, matches, output) => data.召唤次数 == 0,
      promise: async (data, matches) => {
        const boss = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        if (data.地火 === undefined) data.地火 = [];
        data.地火.push(boss.combatants[0]);
        //data.地火.push([matches.x,matches.y]);

      },
      alertText: (data, matches, output) => {
        if (data.地火.length == 6) {
          let 右上危险 = false;
          
          data.地火.forEach(i => {
            let distance = Math.hypot(i.PosX - 118, i.PosY - 100)
            if (distance < 6) 右上危险 = true;
          });
          data.地火.push(1);
          if (右上危险) return '左上安全'
          if (!右上危险) return '右上安全'
        }
      }
    },
    {
      id: '阿提斯之干（去后面）',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7821' }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: '去后面',
      },
    },
    {
      id: '阿提斯之干（去前面）',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7826' }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: '去前面',
      },
    },
    {
      id: '半神豪圣（双奶分摊）',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '783A' }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: '双奶分摊',
      },
    },

    {
      id: '生命的光芒（AOE）',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7839' }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: 'AOE',
      },
    },
    {
      id: 'P7S Inviolate Bonds',
      type: 'GainsEffect',
      // CEC/D45 = Inviolate Winds
      // CED/D56 = Holy Bonds
      netRegex: NetRegexes.gainsEffect({ effectId: ['CEC', 'D45'] }),
      condition: Conditions.targetIsYou(),
      durationSeconds: 20,
      response: (_data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          stackThenSpread: Outputs.stackThenSpread,
          spreadThenStack: Outputs.spreadThenStack,
        };
        const longTimer = parseFloat(matches.duration) > 9;
        if (longTimer)
          return { infoText: output.stackThenSpread() };
        return { infoText: output.spreadThenStack() };
      },
    },
    {
      id: 'P7S Hemitheos\'s Aero IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A0B' }),
      response: Responses.knockback(),
    },
    {
      id: 'P7S Immature Stymphalide Tether',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0011' }),
      // ~9s between tether and Bronze Bellows (no cast) in all cases.
      delaySeconds: 4,
      // Just give this to everyone.  People in towers or elsewhere can be safe.
      suppressSeconds: 1,
      response: Responses.knockback(),
    },
    {
      id: 'P7S Spark of Life',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7839', source: 'Agdistis', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: 'aoe + 流血',
      },
    },
    //四连
    {
      id: '四连读条',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '781E' }),
      run: (data) => {
        data.四连 = true;
      },
    },
    {
      id: 'P7S Inviolate Purgation',
      type: 'GainsEffect',
      // CEE = Purgatory Winds I   钢铁  10
      // D3F = Purgatory Winds II  钢铁  25
      // D40 = Purgatory Winds III 钢铁  40 
      // D41 = Purgatory Winds IV  钢铁  55
      // CEF = Holy Purgation I    月环  10
      // D42 = Holy Purgation II   月环  25
      // D43 = Holy Purgation III  月环  40 
      // D44 = Holy Purgation IV   月环  55
      tts: null,
      netRegex: NetRegexes.gainsEffect({ effectId: ['CEF', 'D4[234]'] }),
      preRun: (data, matches) => {
        if (data.四连) {
          if (matches.effectId == 'CEF') {
            if (data.party.isDPS(matches.target))
              data.四连顺序[0] = 'DPS';
            else
              data.四连顺序[0] = 'TH';
          };
          if (matches.effectId == 'D42') {
            if (data.party.isDPS(matches.target))
              data.四连顺序[1] = 'DPS';
            else
              data.四连顺序[1] = 'TH';
          };
          if (matches.effectId == 'D43') {
            if (data.party.isDPS(matches.target))
              data.四连顺序[2] = 'DPS';
            else
              data.四连顺序[2] = 'TH';
          };
          if (matches.effectId == 'D44') {
            if (data.party.isDPS(matches.target))
              data.四连顺序[3] = 'DPS';
            else
              data.四连顺序[3] = 'TH';
          };
        };
      },
      condition: (data) => {
        return data.四连;
      },
      durationSeconds: 35,
      alertText: (data) => {
        if (data.四连顺序[0] != '' && data.四连顺序[1] != '' && data.四连顺序[2] != '' && data.四连顺序[3] != '') {
          let role;
          if (data.role == 'dps')
            role = 'DPS';
          else
            role = 'TH';
          for (let i = 0; i < data.四连顺序.length; i++) {
            if (role == data.四连顺序[i])
              data.四连播报[i] = '分摊';
            else
              data.四连播报[i] = '分散';
          };
          return data.四连播报[0] + ' ' + data.四连播报[1] + ' ' + data.四连播报[2] + ' ' + data.四连播报[3];
        };
      },
    },
    {
      id: '分摊分散第一次播报',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['CEF', 'D4[234]'] }),
      suppressSeconds: 50,
      condition: (data) => data.四连,
      delaySeconds: 1,
      durationSeconds: 6,
      alertText: (data) => {
        let 位置 = data.四连第一次放置 == '右上' ? '去右上' : '去左上'
        return 位置 + data.四连播报[0];
      },
    },
    {
      id: 'P7S Inviolate Bonds Reminders',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['CEF', 'D4[234]'] }),
      suppressSeconds: 50,
      condition: (data) => data.四连,
      delaySeconds: 10,
      durationSeconds: 6,
      alertText: (data) => {
        let 位置 = data.四连第一次放置 == '右上' ? '去左上' : '去右上'
        return 位置 + data.四连播报[1];
      },
    },
    {
      id: '分摊分散第三次播报',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['CEF', 'D4[234]'] }),
      suppressSeconds: 50,
      condition: (data) => data.四连,
      delaySeconds: 25,
      durationSeconds: 6,
      alertText: (data) => {
        let 位置 = data.四连第一次放置 == '右上' ? '去右上' : '去左上'
        return 位置 + data.四连播报[2];
      },
    },
    {
      id: '分摊分散第死次播报',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['CEF', 'D4[234]'] }),
      suppressSeconds: 50,
      condition: (data) => data.四连,
      delaySeconds: 40,
      durationSeconds: 6,
      alertText: (data) => {
        let 位置 = data.四连第一次放置 == '右上' ? '去左上' : '去右上'
        return 位置 + data.四连播报[3];
      },
    },
    {
      // First breaks north bridge for upcoming South Knockback Spreads
      // Second breaks remaining bridges, Separate Healer Groups
      // Third breaks all bridges, Bait on Empty Platform
      id: 'P7S Roots of Attis 1',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '780E' }),
      condition: (data) => data.rootsCount === 0,
      run: (data) => data.rootsCount = data.rootsCount + 1,
    },
    {
      id: 'P7S Roots of Attis 2',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '780E'}),
      condition: (data) => data.rootsCount === 1,
      infoText: (_data, _matches, output) => output.separateHealerGroups(),
      run: (data) => data.rootsCount = data.rootsCount + 1,
      outputStrings: {
        separateHealerGroups: {
          en: 'Healer Group Platforms',
          de: 'Heiler-Gruppen Plattformen',
          fr: 'Groupes heals Plateforme',
          ja: '円盤の内でヒーラーと頭割り',
          ko: '힐러 그룹별로 플랫폼',
          cn: '双奶分摊',
        },
      },
    },
    {
      id: 'P7S Roots of Attis 3',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '780E'}),
      condition: (data) => data.rootsCount === 2,
      infoText: (_data, _matches, output) => output.baitSoon(),
      outputStrings: {
        baitSoon: {
          en: 'Bait on Empty Platform Soon',
          de: 'Bald auf freier Plattform ködern',
          fr: 'Déposez sur une plateforme vide bientôt',
          ja: '果実がない空きの円盤へ移動',
          ko: '빈 플랫폼에서 장판 유도 준비',
          cn: '移动到没有鸟的位置',
        },
      },
    },
  ],
});