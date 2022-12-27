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
  'job': '枪刃',
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
      re = '枪刃';
      break;
    case 'DNC':
      re = '舞者';
      break;
    case 'RPR':
      re = '镰刀';
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
const THGroup = ['战士', '枪刃', '黑骑', '骑士', '白魔', '占星', '学者', '贤者'];
const positionTo8Dir = (combatant) => {
  const x = combatant.PosX - 100;
  const y = combatant.PosY - 100;
  // Dirs: N = 0, NE = 1, ..., NW = 7
  return Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;
};
let 打开队伍播放 = false;
const sendMessageToParty = (send) => {
  if (打开队伍播放) {
    callOverlayHandler({ call: 'PostNamazu', c: 'command', p: '/p ' + send });
  } else callOverlayHandler({ call: 'PostNamazu', c: 'command', p: '/e ' + send });
}
const matchedPositionTo4Dir = (combatant) => {
  // Positions are moved up 100 and right 100
  const y = combatant.PosY - 100;
  const x = combatant.PosX - 100;

  // During the vault knights, Adelphel will jump to one of the 4 cardinals
  // N = (100, 78), E = (122, 100), S = (100, 122), W = (78, 100)
  //
  // N = 0, E = 1, S = 2, W = 3

  return (Math.round(2 - 2 * Math.atan2(x, y) / Math.PI) % 4);
};
let camera;
addOverlayListener("onPlayerControl", (e) => {
  camera = e.detail;
});
let originalMark = undefined;
const getOneMark = (i = 4) => {
  let aPos = camera.ONE;
  if (!aPos.Active) {
    return false;
  }
  let 位置 = 0;
  if (i == 4) {
    位置 = Math.round(2 - 2 * Math.atan2(aPos.X - 100, aPos.Z - 100) / Math.PI) % 4;
  }
  if (i == 8) {
    位置 = Math.round(4 - 4 * Math.atan2(aPos.X - 100, aPos.Z - 100) / Math.PI) % 8;
  }

  return 位置;
};
Options.Triggers.push({
  zoneId: ZoneId.AbyssosTheEighthCircleSavage,
  overrideTimelineFile: true,
  timelineFile: "p8s.txt",
  initData: () => {
    callOverlayHandler({
      call: 'getConfig',
    }).then(data => shunxu = data.shunxu);
    return {
      combatantData: [],
      torches: [],
      flareTargets: [],
      upliftCounter: 0,
      snake: [],
      illuCount: 0,
      分身: 0,
      兽二: 0,
      三连龙: 0,
      concept: {},
      splicer: {},
      alignmentTargets: [],
      inverseMagics: {},
      deformationTargets: [],
      运动会次数: 0,
      塔次数: 0,
    };
  },
  timelineTriggers: [
    {
      id: 'P8S Tank Cleave Autos',
      regex: /--auto--/,
      beforeSeconds: 8,
      suppressSeconds: 20,
      alertText: (data, _matches, output) => {
        // TODO: because of how the timeline starts in a doorboss fight, this call occurs
        // somewhere after the first few autos and so feels really weird.  Ideally, figure
        // out some way to call this out immediately when combat starts?? Maybe off engage?
        if (data.seenFirstTankAutos)
          return output.text();
      },
      run: (data) => data.seenFirstTankAutos = true,
      outputStrings: {
        text: {
          en: 'Tank Autos',
          ko: '탱커 평타',
          cn: '分摊平a',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'P8S Genesis of Flame',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7944' }),
      response: Responses.aoe(),
    },
    {
      id: 'P8S Flameviper',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7945' }),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'P8S Conceptual Tetraflare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7915' }),
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.conceptual = 'tetra',
      outputStrings: {
        text: {
          en: '(partner stack, for later)',
          de: '(Partner-Stacks, für später)',
          cn: '稍后分摊'
        },
      },
    },
    {
      id: 'P8S Conceptual Octaflare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7914' }),
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.conceptual = 'octa',
      outputStrings: {
        text: {
          en: '(spread, for later)',
          de: '(Verteilen, für später)',
          cn: '稍后分散'
        },
      },
    },
    {
      id: 'P8S Conceptual Tetraflare重复',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7915' }),
      delaySeconds: (data, _matches, output) => {
        if (data.三连龙 == 0) return 20
        if (data.三连龙 > 0) return 40
      },
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.conceptual = 'tetra',
      outputStrings: {
        text: {
          en: '(partner stack, for later)',
          de: '(Partner-Stacks, für später)',
          cn: '稍后分摊'
        },
      },
    },
    {
      id: 'P8S Conceptual Octaflare重复',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7914' }),
      delaySeconds: (data, _matches, output) => {
        originalMark = undefined;
        if (data.三连龙 == 0) return 20
        if (data.三连龙 > 0) return 40
      },
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.conceptual = 'octa',
      outputStrings: {
        text: {
          en: '(spread, for later)',
          de: '(Verteilen, für später)',
          cn: '稍后分散'
        },
      },
    },
    {
      id: 'P8S Torch Flame Collect',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7927' }),
      run: (data, matches) => data.torches.push(matches),
    },
    {
      id: 'P8S Torch Flame',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7927' }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      promise: async (data) => {
        data.combatantData = [];
        const ids = data.torches.map((torch) => parseInt(torch.sourceId, 16));
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: ids,
        })).combatants;
        data.torches = [];
      },
      alertText: (data, _matches, output) => {
        if (data.combatantData.length === 0)
          return;
        const safe = {
          cornerNW: true,
          cornerNE: true,
          cornerSE: true,
          cornerSW: true,
          // Unlike normal mode, these "outside" are two tiles and not 4,
          // e.g. "outsideNorth" = NNW/NNE tiles.
          // The ordering here matters.
          outsideNorth: true,
          insideNorth: true,
          outsideWest: true,
          insideWest: true,
          outsideEast: true,
          insideEast: true,
          outsideSouth: true,
          insideSouth: true,
        };
        // idx = x + y * 4
        // This map is the tile index mapped to the keys that any
        // torch exploding on that square would make unsafe.
        const unsafeMap = {
          0: ['cornerNW'],
          1: ['outsideNorth'],
          2: ['outsideNorth'],
          3: ['cornerNE'],
          4: ['outsideWest'],
          5: ['insideWest', 'insideNorth'],
          6: ['insideEast', 'insideNorth'],
          7: ['outsideEast'],
          8: ['outsideWest'],
          9: ['insideWest', 'insideSouth'],
          10: ['insideEast', 'insideSouth'],
          11: ['outsideEast'],
          12: ['cornerSW'],
          13: ['outsideSouth'],
          14: ['outsideSouth'],
          15: ['cornerSE'],
        };
        // Loop through all torches, remove any rows/columns it intersects with
        // to find safe lanes.
        for (const torch of data.combatantData) {
          // x, y = 85, 95, 105, 115
          // map to ([0, 3], [0, 3])
          const x = Math.floor((torch.PosX - 85) / 10);
          const y = Math.floor((torch.PosY - 85) / 10);
          const idx = x + y * 4;
          const unsafeArr = unsafeMap[idx];
          for (const entry of unsafeArr ?? [])
            delete safe[entry];
        }
        const safeKeys = Object.keys(safe);
        const [safe0, safe1, safe2, safe3] = safeKeys;
        // Unexpectedly zero safe zones.
        console.log(safeKeys);
        if (safe0 === undefined)
          return;
        // Special case inner four squares.
        if (
          safeKeys.length === 4 &&
          // Ordered same as keys above.
          safe0 === 'insideNorth' &&
          safe1 === 'insideWest' &&
          safe2 === 'insideEast' &&
          safe3 === 'insideSouth'
        )
          return output.insideSquare();
        // Not set up to handle more than two safe zones.
        if (safe2 !== undefined)
          return;
        if (safe1 === undefined)
          return output[safe0]();
        const dir1 = output[safe0]();
        const dir2 = output[safe1]();
        return output.combo({ dir1: dir1, dir2: dir2 });
      },
      outputStrings: {
        combo: {
          en: '${dir1} / ${dir2}',
          de: '${dir1} / ${dir2}',
          ja: '${dir1} / ${dir2}',
          ko: '${dir1} / ${dir2}',
          cn: '${dir1} / ${dir2}',
        },
        insideSquare: {
          en: 'Inside Square',
          de: 'Inneres Viereck',
          cn: '场内'
        },
        cornerNW: {
          en: 'NW Corner',
          de: 'NW Ecke',
          cn: '左上角',
        },
        cornerNE: {
          en: 'NE Corner',
          de: 'NO Ecke',
          cn: '右上角',
        },
        cornerSE: {
          en: 'SE Corner',
          de: 'SO Ecke',
          cn: '右下角',
        },
        cornerSW: {
          en: 'SW Corner',
          de: 'SW Ecke',
          cn: '左下角',
        },
        outsideNorth: {
          en: 'Outside North',
          de: 'Im Norden raus',
          fr: 'Nord Extérieur',
          ja: '北、外側',
          ko: '북쪽, 바깥',
          cn: '上外侧'
        },
        insideNorth: {
          en: 'Inside North',
          de: 'Im Norden rein',
          fr: 'Nord Intérieur',
          ja: '北、内側',
          ko: '북쪽, 안',
          cn: '上内侧'
        },
        outsideEast: {
          en: 'Outside East',
          de: 'Im Osten raus',
          fr: 'Est Extérieur',
          ja: '東、外側',
          ko: '동쪽, 바깥',
          cn: '右外侧'
        },
        insideEast: {
          en: 'Inside East',
          de: 'Im Osten rein',
          fr: 'Est Intérieur',
          ja: '東、内側',
          ko: '동쪽, 안',
          cn: '右内侧'
        },
        outsideSouth: {
          en: 'Outside South',
          de: 'Im Süden raus',
          fr: 'Sud Extérieur',
          ja: '南、外側',
          ko: '남쪽, 바깥',
          cn: '下外侧'
        },
        insideSouth: {
          en: 'Inside South',
          de: 'Im Süden rein',
          fr: 'Sud Intérieur',
          ja: '南、内側',
          ko: '남쪽, 안',
          cn: '下内侧'
        },
        outsideWest: {
          en: 'Outside West',
          de: 'Im Westen raus',
          fr: 'Ouest Extérieur',
          ja: '西、外側',
          ko: '서쪽, 바깥',
          cn: '左外侧'
        },
        insideWest: {
          en: 'Inside West',
          de: 'Im Westen rein',
          fr: 'Ouest Intérieur',
          ja: '西、内側',
          ko: '서쪽, 안',
          cn: '左内侧'
        },
      },
    },
    {
      id: '蛇收集',
      type: 'StartsUsing',
      condition: (data, matches) => data.snakeCount < 2,
      netRegex: NetRegexes.startsUsing({ id: '792B' }),
      run: (data, matches) => {
        data.snake.push(matches)
      },

    },
    {
      id: 'P8S Gorgon Location',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '792B' }),
      promise: async (data, matches) => {
        const boss = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        let bossData = boss.combatants[0];
        if (data.蛇位置 === undefined) data.蛇位置 = [];
        data.蛇位置.push(bossData);
      },
      alertText: (data, matches, output) => {
        if (data.蛇位置.length == 2 && !data.三连龙) {
          let 方位 = ['上', '右上', '右', '右下', '下', '左下', '左', '左上'];
          let 方位1 = Math.round(4 - 4 * Math.atan2(data.蛇位置[0].PosX - 100, data.蛇位置[0].PosY - 100) / Math.PI) % 8;
          let 方位2 = Math.round(4 - 4 * Math.atan2(data.蛇位置[1].PosX - 100, data.蛇位置[1].PosY - 100) / Math.PI) % 8;
          let 位置 = [方位1, 方位2];
          位置.sort();
          if (data.SnakePos === undefined) data.SnakePos = [];
          let bobao;
          if (位置[1] - 位置[0] == 2 || 位置[1] - 位置[0] == 6) {
            if (位置[1] >= 6 && 位置[0] <= 2) bobao = 方位[(位置[1] + 1) % 8];
            else bobao = 方位[位置[0] + 1];
          }
          else {
            bobao = 方位[位置[0] + 2];
          }
          data.SnakePos = [方位[位置[0]], 方位[位置[1]]];
          return 方位[方位1] + '/' + 方位[方位2] + '\n站在' + bobao;
        }
      },
    },
    {
      id: '蛇位置删除',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '792B' }),
      delaySeconds: 2,
      run: (data, matches, output) => {
        delete data.蛇位置;
      },
    },
    {
      id: '扇形1',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D17' }),
      condition: (data, matches) => matches.duration == "23.00",
      alertText: (data, matches, output) => {
        if (data.扇形1 == undefined) data.扇形1 = [];
        data.扇形1.push(nametocnjob(matches.target, data));
        if (data.扇形1.length == 2) {
          data.扇形1.sort((a, b) => {
            return shunxu.find((c) => c.job == a).order - shunxu.find((c) => c.job == b).order
          });
        }

        if (matches.target == data.me) {
          return "一组扇形"
        }
      }
    },
    {
      id: '扇形1喷射',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D17' }),
      condition: (data, matches) => matches.duration == "23.00",
      delaySeconds: (data, matches) => parseFloat(matches.duration) - 8,
      suppressSeconds: 10,
      alertText: (data, matches, output) => {
        if (data.扇形1.length == 2) {
          let myJob = nametocnjob(data.me, data);
          let 扇形1位置 = data.扇形1.indexOf(myJob);
          if (扇形1位置 !== -1) return '去' + data.SnakePos[扇形1位置] + '喷射'
        }
      }
    },
    {
      id: '扇形2',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D17' }),
      condition: (data, matches) => matches.duration == "31.00",
      alertText: (data, matches, output) => {
        if (data.扇形2 == undefined) data.扇形2 = [];
        data.扇形2.push(nametocnjob(matches.target, data));
        if (data.扇形2.length == 2) {
          data.扇形2.sort((a, b) => {
            return shunxu.find((c) => c.job == a).order - shunxu.find((c) => c.job == b).order
          });
        }

        if (matches.target == data.me) {
          return "二组扇形"
        }
      }
    },
    {
      id: '扇形2喷射',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D17' }),
      condition: (data, matches) => matches.duration == "31.00",
      suppressSeconds: 10,
      delaySeconds: (data, matches) => parseFloat(matches.duration) - 8,
      alertText: (data, matches, output) => {
        if (data.扇形2.length == 2) {
          let myJob = nametocnjob(data.me, data);
          let 扇形2位置 = data.扇形2.indexOf(myJob);
          if (扇形2位置 !== -1) return '去' + data.SnakePos[扇形2位置] + '喷射'
        }
      }
    },
    {
      id: '毒1',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CFE' }),
      condition: (data, matches) => matches.duration == "26.00",
      alertText: (data, matches, output) => {
        if (data.poison1 == undefined) data.poison1 = [];
        data.poison1.push(nametocnjob(matches.target, data));
        if (data.poison1.length == 2) {
          data.poison1.sort((a, b) => {
            return shunxu.find((c) => c.job == a).order - shunxu.find((c) => c.job == b).order
          });

        }
        if (matches.target == data.me) {
          return "一组毒"
        }
      }
    },
    {
      id: '毒1放毒',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CFE' }),
      condition: (data, matches) => matches.duration == "26.00",
      delaySeconds: (data, matches) => parseFloat(matches.duration) - 10,
      suppressSeconds: 10,
      alertText: (data, matches, output) => {
        if (data.poison1.length == 2) {
          let myJob = nametocnjob(data.me, data);
          let poison1 = data.poison1.indexOf(myJob);
          if (poison1 !== -1) return '去' + data.SnakePos[poison1] + '放毒'
        }
      }
    },
    {
      id: '毒2',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CFE' }),
      condition: (data, matches) => matches.duration == "34.00",
      alertText: (data, matches, output) => {
        if (data.poison2 == undefined) data.poison2 = [];
        data.poison2.push(nametocnjob(matches.target, data));
        if (data.poison2.length == 2) {
          data.poison2.sort((a, b) => {
            return shunxu.find((c) => c.job == a).order - shunxu.find((c) => c.job == b).order
          });

        }
        if (matches.target == data.me) {
          return "二组毒"
        }
      }
    },
    {
      id: '毒2放毒',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CFE' }),
      condition: (data, matches) => matches.duration == "34.00",
      delaySeconds: (data, matches) => parseFloat(matches.duration) - 10,
      suppressSeconds: 10,
      alertText: (data, matches, output) => {
        if (data.poison1.length == 2) {
          let myJob = nametocnjob(data.me, data);
          let poison2 = data.poison2.indexOf(myJob);
          if (poison2 !== -1) return '去' + data.SnakePos[poison2] + '放毒'
        }
      }
    },
    {
      id: '蛇位置',
      type: 'StartsUsing',
      condition: (data, matches) => data.snakeCount < 2,
      netRegex: NetRegexes.startsUsing({ id: '792B' }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      promise: async (data) => {
        data.combatantData = [];
        const ids = data.snake.map((s) => parseInt(s.sourceId, 16));
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: ids,
        })).combatants;
        let posA = matchedPositionToDir(data.combatantData[0])
        let posB = matchedPositionToDir(data.combatantData[1])

        if ((posA + 1) % 8 < (posB + 1) % 8) {
          if (data.snakeCount == 0) {
            data.扇形1 = []
            data.poison1 = []
          }
          if (data.snakeCount == 1) {
            data.扇形2 = []
            data.poison2 = []
          }
        } else {
          if (data.snakeCount == 0) {

            data.扇形1 = []
            data.poison1 = []
          }
          if (data.snakeCount == 1) {
            data.poison2 = []
          }
        }
        data.snake = []
        data.snakeCount++
      },

    },
    {
      id: '蛇2分摊',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CFF' }),
      alertText: (data, matches, output) => {
        if (data.分摊 == undefined) data.分摊 = [];
        data.分摊.push(nametocnjob(matches.target, data));
        if (data.分摊.length == 2) {
          if (data.partJob === undefined) data.partJob = [];
          for (let i = 0; i < 8; i++) {
            let job = nametocnjob(data.party.idToName_[data.party.partyIds_[i]], data);
            data.partJob[i] = { 'ID': data.party.partyIds_[i], 'job': job };
          }
          data.分摊.sort((a, b) => {
            return shunxu.find((c) => c.job == a).order - shunxu.find((c) => c.job == b).order
          });
          let 标记1 = data.分摊.map((i) => data.partJob.find((j) => j.job == i))

          // console.log(标记1)
          sendMessageToParty("分灘：" + data.分摊[0] + " " + data.分摊[1])
          return "分摊：" + data.分摊[0] + " " + data.分摊[1]
        }
      }
    },
    {
      id: '蛇2背对',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D18' }),
      alertText: (data, matches, output) => {

        if (data.背对 == undefined) data.背对 = [];
        data.背对.push(nametocnjob(matches.target, data));
        if (data.背对.length == 2) {
          if (data.partJob === undefined) data.partJob = [];
          for (let i = 0; i < 8; i++) {
            let job = nametocnjob(data.party.idToName_[data.party.partyIds_[i]], data);
            data.partJob[i] = { 'ID': data.party.partyIds_[i], 'job': job };
          }
          data.背对.sort((a, b) => {
            return shunxu.find((c) => c.job == a).order - shunxu.find((c) => c.job == b).order
          });
          return "大圈：" + data.背对[0] + " " + data.背对[1]
        }
      }
    },
    // 兽2
    {
      id: '跳跃钢铁',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A05' }),
      alertText: (data, _, output) => "钢铁",
    },
    {
      id: '跳跃击退',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A04' }),
      alertText: (data, _, output) => "击退",
    },
    {
      id: 'P8S 中间',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7910' }),
      durationSeconds: 5,
      alertText: (data, matches, output) => {
        return '去两边'
      },
    },
    {
      id: 'P8S 两边',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7911' }),
      durationSeconds: 5,
      alertText: (data, matches, output) => {
        return '去中间'
      },
    },
    {
      id: 'P8S Ektothermos',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79EA' }),
      response: Responses.aoe(),
    },
    {
      id: 'P8S Footprint',
      type: 'Ability',
      // There is 6.4 seconds between this Reforged Reflection ability and the Footprint (7109) ability.
      netRegex: NetRegexes.ability({ id: '794B' }),
      delaySeconds: 1.5,
      response: Responses.knockback(),
    },
    {
      id: 'P8S Snaking Kick',
      type: 'StartsUsing',
      // This is the Reforged Reflection cast.
      netRegex: NetRegexes.startsUsing({ id: '794C' }),
      response: Responses.getOut(),
    },
    {
      id: '核爆',
      type: 'StartsUsing',
      // has 78EC Sunforge castbar
      netRegex: NetRegexes.startsUsing({ id: '78F2' }),
      alertText: (data, _, output) => '场中集合',
    },
    {
      id: 'P8S Uplift Counter',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['7935'] }),
      // Count in a separate trigger so that we can suppress it, but still call out for
      // both people hit.
      preRun: (data, _matches) => data.upliftCounter++,
      suppressSeconds: 1,
      sound: '',
      durationSeconds: 20,
      infoText: (data, _matches, output) => output.text({ num: data.upliftCounter }),
      tts: null,
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}',
          cn: '${num}',
          ko: '${num}',
        },
      },
    },
    {
      id: 'P8S First Snake Debuff Initial Call',
      type: 'GainsEffect',
      netRegex: { effectId: ['BB[CD]', 'D17', 'CFE'], capture: false },
      condition: (data) => !data.firstSnakeCalled,
      delaySeconds: 0.3,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          firstGaze: {
            en: 'First Gaze (w/ ${player})',
            de: 'Erster Blick (+ ${player})',
            fr: 'Premier Regard (+ ${player})',
            ja: '先の石化 (+${player})',
            cn: '1组 石化 (+ ${player})',
            ko: '첫번째 석화 (+ ${player})',
          },
          secondGaze: {
            en: 'Second Gaze (w/ ${player})',
            de: 'Zweiter Blick (+ ${player})',
            fr: 'Second Regard (+ ${player})',
            ja: '後の石化 (+${player})',
            cn: '2组 石化 (+ ${player})',
            ko: '두번째 석화 (+ ${player})',
          },
          firstPoison: {
            en: 'First Poison (w/ ${player})',
            de: 'Erstes Gift (+ ${player})',
            fr: 'Premier Poison (+ ${player})',
            ja: '先の毒 (+${player})',
            cn: '1组 毒 (+ ${player})',
            ko: '첫번째 독장판 (+ ${player})',
          },
          secondPoison: {
            en: 'Second Poison (w/ ${player})',
            de: 'Zweites Gift (+ ${player})',
            fr: 'Second Poison (+ ${player})',
            ja: '後の毒 (+${player})',
            cn: '2组 毒 (+ ${player})',
            ko: '두번째 독장판 (+ ${player})',
          },
          unknown: Outputs.unknown,
        };
        const myNumber = data.firstSnakeOrder[data.me];
        if (myNumber === undefined)
          return;
        const myDebuff = data.firstSnakeDebuff[data.me];
        if (myDebuff === undefined)
          return;
        let partner = output.unknown();
        for (const [name, theirDebuff] of Object.entries(data.firstSnakeDebuff)) {
          if (myDebuff !== theirDebuff || name === data.me)
            continue;
          const theirNumber = data.firstSnakeOrder[name];
          if (myNumber === theirNumber) {
            partner = nametocnjob(name, data);
            break;
          }
        }
        if (myNumber === 1) {
          if (myDebuff === 'gaze')
            return { alertText: output.firstGaze({ player: partner }) };
          return { alertText: output.firstPoison({ player: partner }) };
        }
        if (myDebuff === 'gaze')
          return { infoText: output.secondGaze({ player: partner }) };
        return { infoText: output.secondPoison({ player: partner }) };
      },
      run: (data) => data.firstSnakeCalled = true,
    },
    {
      id: 'P8S Uplift Number',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['7935'] }),
      condition: Conditions.targetIsYou(),
      // ~12.8 seconds between #1 Uplift (7935) to #1 Stomp Dead (7937)
      // ~13.8 seconds between #4 Uplift (7935) to #4 Stomp Dead (7937).
      // Split the difference with 13.3 seconds.
      durationSeconds: 13.3,
      alertText: (data, _matches, output) => output.text({ num: data.upliftCounter }),
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}',
          cn: '${num}',
          ko: '${num}',
        },
      },
    },
    {
      id: 'P8S Second Snake Debuff Collect',
      // D17 = Eye of the Gorgon (gaze)
      // D18 = Crown of the Gorgon (shriek)
      // CFE = Blood of the Gorgon (small poison)
      // CFF = Breath of the Gorgon (stack poison)
      type: 'GainsEffect',
      netRegex: { effectId: ['D1[78]', 'CFF'] },
      condition: (data) => data.firstSnakeCalled,
      run: (data, matches) => {
        const id = matches.effectId;
        if (id === 'D17') {
          // 23s short, 29s long
          const duration = parseFloat(matches.duration);
          data.secondSnakeGazeFirst[matches.target] = duration < 24;
          data.secondSnakeDebuff[matches.target] ??= 'nothing';
        } else if (id === 'D18') {
          data.secondSnakeDebuff[matches.target] = 'shriek';
        } else if (id === 'CFF') {
          data.secondSnakeDebuff[matches.target] = 'stack';
        }
      },
    },
    {
      id: 'P8S Second Snake Debuff Initial Call',
      type: 'GainsEffect',
      netRegex: { effectId: ['D1[78]', 'CFF'], capture: false },
      condition: (data) => data.firstSnakeCalled,
      delaySeconds: 0.3,
      durationSeconds: 6,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          firstGaze: {
            en: 'First Gaze',
            de: 'Erster Blick',
            fr: 'Premier Regard',
            ja: '先の石化',
            cn: '1组 石化',
            ko: '첫번째 석화',
          },
          secondGaze: {
            en: 'Second Gaze',
            de: 'Zweiter Blick',
            fr: 'Second Regard',
            ja: '後の石化',
            cn: '2组 石化',
            ko: '두번째 석화',
          },
          shriek: {
            en: 'Shriek later (with ${player})',
            de: 'Schrei später (mit ${player})',
            fr: 'Cri plus tard (avec ${player})',
            ja: '自分に魔眼 (+${player})',
            cn: '石化点名 (+ ${player}',
            ko: '나중에 마안 (+ ${player})',
          },
          stack: {
            en: 'Stack later (with ${player})',
            de: 'Später sammeln (mit ${player})',
            fr: 'Package plus tard (avec ${player})',
            ja: '自分に頭割り (+${player})',
            ko: '나중에 쉐어 (+ ${player})',
          },
          noDebuff: {
            en: 'No debuff (w/ ${player1}, ${player2}, ${player3})',
            de: 'Kein Debuff (+ ${player1}, ${player2}, ${player3})',
            fr: 'Aucun debuff (+ ${player1}, ${player2}, ${player3})',
            ja: '無職 (${player1}, ${player2}, ${player3})',
            cn: '无Debuff (+ ${player1}, ${player2}, ${player3})',
            ko: '디버프 없음 (+ ${player1}, ${player2}, ${player3})',
          },
        };
        const isGazeFirst = data.secondSnakeGazeFirst[data.me];
        const myDebuff = data.secondSnakeDebuff[data.me];
        if (isGazeFirst === undefined || myDebuff === undefined)
          return;
        const friends = [];
        for (const [name, theirDebuff] of Object.entries(data.secondSnakeDebuff)) {
          if (myDebuff === theirDebuff && name !== data.me)
            friends.push(nametocnjob(name, data));
        }
        const gazeAlert = isGazeFirst ? output.firstGaze() : output.secondGaze();
        if (myDebuff === 'nothing') {
          return {
            alertText: gazeAlert,
            infoText: output.noDebuff({
              player1: friends[0],
              player2: friends[1],
              player3: friends[2],
            }),
          };
        }
        if (myDebuff === 'shriek') {
          return {
            alertText: gazeAlert,
            infoText: output.shriek({ player: friends[0] }),
          };
        }
        if (myDebuff === 'stack') {
          return {
            alertText: gazeAlert,
            infoText: output.stack({ player: friends[0] }),
          };
        }
      },
    },
    {
      id: 'P8S Hemitheos\'s Flare Hit',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '72CE' }),
      preRun: (data, matches) => data.flareTargets.push(matches.target),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text();
      },
      outputStrings: {
        text: {
          en: '(avoid proteans)',
          de: '(weiche Himmelsrichtungen aus)',
          cn: '去正点躲避'
        },
      },
    },
    {
      id: '正斜点蛇提前播报',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatantFull({ npcBaseId: '15052' }),
      suppressSeconds: 1,
      promise: async (data, matches) => {
        data.snakePos = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.id, 16)],
        });
        return;
      },
      alertText: (data, matches, output) => {
        if (!data.三连龙) {
          if (data.snakePos.combatants[0].PosX == 100 || data.snakePos.combatants[0].PosY == 100) {
            return "正点蛇"
          }
          return "斜点蛇"
        }
        else {
          if (data.snakePos.combatants[0].PosX == 100 || data.snakePos.combatants[0].PosY == 100) {
            return "正点蛇看斜点"
          }
          return "斜点蛇看正点"
        }

      },
    },
    // 蛇2分身
    {
      id: '分身俯冲',
      type: 'StartsUsing',
      suppressSeconds: 1,
      netRegex: NetRegexes.startsUsing({ id: '7932' }),
      promise: async (data, matches) => {
        data.combatantData = [];
        data.combatantData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        return;
      },
      preRun: (data) => { data.分身++ },
      alertText: (data, matches, output) => {
        if (data.分身 == 2) {

          if (data.combatantData.combatants[0].PosX == 80 || data.combatantData.combatants[0].PosX == 120) {
            if (data.combatantData.combatants[0].PosY < 100) {
              return "三四安全"
            } else if (data.combatantData.combatants[0].PosY == 100) {
              return "AC安全"
            } else
              return "一二安全"

          } else {
            if (data.combatantData.combatants[0].PosX < 100) {
              return "二三安全"
            } else if (data.combatantData.combatants[0].PosX == 100) {
              return "BD安全"
            } else
              return "一四安全"
          }
        }
      },
    },
    {
      id: '换位提示',
      type: 'StartsUsing',
      suppressSeconds: 1,
      delaySeconds: 1,
      netRegex: NetRegexes.startsUsing({ id: '7932' }),
      alertText: (data, matches, output) => {
        if (data.分身 == 2) {
          let myJob = nametocnjob(data.me, data);
          //TH分组是分摊
          // if (data.分摊.find((x)=>THGroup.some((item) => x === item))) {

          //   }
          if (myJob == data.分摊[1] || myJob == data.背对[0])
            return '去换位'
          else return data.分摊[1] + '和' + data.背对[0] + '换位'

        }
      },
    },
    // 兽2击退&钢铁
    {
      id: '兽二钢铁',
      type: 'StartsUsing',
      preRun: (data) => { data.兽二++ },
      suppressSeconds: 1,
      netRegex: NetRegexes.startsUsing({ id: ['793D'] }),
      promise: async (data, matches) => {
        data.combatantData = [];
        data.combatantData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        return;
      },
      alertText: (data, matches, output) => {
        if (data.combatantData.combatants[0].PosX == 100) {
          if (data.combatantData.combatants[0].PosY < 100) {
            sendMessageToParty("第" + data.兽二 + "次 : C C C")
            return "去C"
          } else {
            sendMessageToParty("第" + data.兽二 + "次 : A A A")
            return "去A"
          }

        } else {
          if (data.combatantData.combatants[0].PosX < 100) {
            sendMessageToParty("第" + data.兽二 + "次 : B B B")
            return "去B"
          } else {
            sendMessageToParty("第" + data.兽二 + "次 : D D D")
            return "去D"
          }
        }
      },
    },
    {
      id: 'P8S Conceptual Tetraflare Quadruped',
      type: 'StartsUsing',
      // 7915 normally
      // 7916 during Blazing Footfalls
      netRegex: NetRegexes.startsUsing({ id: '7916' }),
      durationSeconds: 20,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Partner Stacks',
          de: 'Mit Partner sammeln',
          ja: '2人頭割り',
          ko: '2인 쉐어',
          cn: '双人分摊',
        },
      },
    },
    {
      id: 'P8S Conceptual Tetraflare',
      type: 'StartsUsing',
      // 7915 normally
      // 7916 during Blazing Footfalls
      netRegex: NetRegexes.startsUsing({ id: '7915' }),
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.conceptual = 'tetra',
      outputStrings: {
        text: {
          en: '(partner stack, for later)',
          de: '(Partner-Stacks, für später)',
          ja: '(後で2人頭割り)',
          ko: '(곧 2인 쉐어)',
          cn: '2人分摊',
        },
      },
    },
    {
      id: 'P8S Octaflare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '791D' }),
      response: Responses.spread('alarm'),
    },
    {
      id: 'P8S Conceptual Octaflare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7914' }),
      infoText: (_data, _matches, output) => output.text(),
      run: (data) => data.conceptual = 'octa',
      outputStrings: {
        text: {
          en: '(spread, for later)',
          de: '(Verteilen, für später)',
          ja: '(後で散会)',
          ko: '(곧 산개)',
          cn: '最后分散',
        },
      },
    },
    {
      id: '兽二击退',
      type: 'StartsUsing',
      suppressSeconds: 1,
      preRun: (data) => { data.兽二++ },
      netRegex: NetRegexes.startsUsing({ id: ['793C'] }),
      promise: async (data, matches) => {
        data.combatantData = [];
        data.combatantData = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        return;
      },
      alertText: (data, matches, output) => {
        if (data.combatantData.combatants[0].PosX == 100) {
          if (data.combatantData.combatants[0].PosY < 100) {
            sendMessageToParty("第" + data.兽二 + "次 : A A A")
            return "去A"
          } else {
            sendMessageToParty("第" + data.兽二 + "次 : C C C")
            return "去C"
          }

        } else {
          if (data.combatantData.combatants[0].PosX < 100) {
            sendMessageToParty("第" + data.兽二 + "次 : D D D")
            return "去D"
          } else {
            sendMessageToParty("第" + data.兽二 + "次 : B B B")
            return "去B"
          }
        }
      },
    },

    {
      id: 'P8S Hemitheos\'s Flare Not Hit',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '72CE' }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        if (!data.flareTargets.includes(data.me))
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'In for Protean',
          de: 'rein für Himmelsrichtungen',
          ja: '内側で散会',
          cn: '引导射线'
        },
      },
    },
    {
      id: '车技能',
      type: 'Ability',
      netRegex: NetRegexes.startsUsing({ id: ['793B', '793C', '793D'] }),
      delaySeconds: 0.5,
      durationSeconds: 20,
      alertText: (data, matches, output) => {
        if (data.四连车 === undefined) data.四连车 = [];
        if (matches.id == '793B') data.四连车.push('冲锋');
        if (matches.id == '793C') data.四连车.push('击退');
        if (matches.id == '793D') data.四连车.push('远离');
        if (data.四连车.length >= 4) {
          sendMessageToParty(`${data.四连车[0]}->${data.四连车[1]}->${data.四连车[2]}->${data.四连车[3]}`);
          return `${data.四连车[0]}->${data.四连车[1]}->${data.四连车[2]}->${data.四连车[3]}`
        }
      },
    },
    {
      id: 'P8S Sun\'s Pinion',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7913' }),
      // There are two casts, one for each side.
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.conceptual === 'octa')
          return output.inAndSpread();
        if (data.conceptual === 'tetra')
          return output.inAndStacks();
        return output.in();
      },
      run: (data) => delete data.conceptual,
      outputStrings: {
        in: Outputs.in,
        inAndSpread: {
          en: 'In + Spread',
          de: 'Rein + Verteilen',
          ja: '内側 + 散会',
          cn: '内侧分散',
        },
        inAndStacks: {
          en: 'In + Stacks',
          de: 'Rein + Sammeln',
          ja: '内側 + 頭割り',
          cn: '内侧分摊',
        },
      },
    },
    {
      id: '三连龙',
      type: 'startsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7925' }),
      //condition: (data, matches, output) => data.三连龙 <= 2,
      promise: async (data, matches) => {
        const boss = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        let bossData = boss.combatants[0];
        if (data.龙 === undefined) data.龙 = [];
        data.龙.push(bossData);
        return;
      },
      alarmText: (data, matches, output) => {
        data.三连龙++;
        if (data.龙.length == 2) {
          let bobao = ['1', '2', '3', '4'];
          if (getOneMark(8) == 1) {
            bobao = ['4', '1', '2', '3'];
          }

          data.龙.forEach(i => {

            let 方位1 = Math.round(4 - 4 * Math.atan2(i.PosX - 100, i.PosY - 100) / Math.PI) % 8;

            if (方位1 == 1) delete bobao[1];
            if (方位1 == 3) delete bobao[2];
            if (方位1 == 5) delete bobao[3];
            if (方位1 == 7) delete bobao[0];
          });
          delete data.龙;
          bobao = bobao.filter(s => s && s.trim());
          return bobao[0] + bobao[1];
        }
      },
    },
    {
      id: '三连龙后续判断',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['7923', '7924'] }),
      //condition:(data, matches, output) =>data.三连龙>=1,
      promise: async (data, matches) => {
        const boss = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        let bossData = boss.combatants[0];
        if (data.龙1 === undefined) data.龙1 = [];
        if (data.龙1.length == 0) {
          data.龙1.push(bossData)
        }
        data.龙1.forEach(i => {
          if (i.ID != bossData.ID) {
            data.龙1.push(bossData)
          }
        });

      },
      alarmText: (data, matches, output) => {
        if (data.龙1.length >= 2) {
          let bobao = ['2', '3', '4', '1'];
          if (getOneMark(8) == 1) {
            bobao = ['1', '2', '3', '4'];
          }
          data.龙1.forEach(i => {

            let 方位1 = Math.round(4 - 4 * Math.atan2(i.PosX - 100, i.PosY - 100) / Math.PI) % 8;
            let Boss面相 = Math.round(4 - 4 * parseFloat(i.Heading) / Math.PI) % 8;

            //顺时针
            if ((Boss面相 + 8 - 方位1) % 8 <= 3) {
              let a = Math.floor(方位1 / 2);
              delete bobao[(a + 1) % 4];
            }
            //逆时针
            if ((Boss面相 + 8 - 方位1) % 8 >= 5) {
              let a = Math.floor(方位1 / 2);
              delete bobao[(a + 4 - 1) % 4];
            }
            //斜点
            if ((Boss面相 + 8 - 方位1) % 8 == 4) {
              let a = Math.floor(方位1 / 2);
              delete bobao[(a + 2) % 4];
            }
          });
          delete data.龙1;
          bobao = bobao.filter(s => s && s.trim());
          return bobao[0] + '点' + bobao[1] + '点';
        }
      },
    },
    // {
    //   id: 'P8S凤凰',
    //   type: 'StartsUsing',
    //   // This is the Reforged Reflection cast.
    //   netRegex: NetRegexes.startsUsing({ id: '7953' }),
    //   promise: async (data, matches) => {
    //     const boss = await callOverlayHandler({
    //       call: 'getCombatants',
    //       ids: [parseInt(matches.sourceId, 16)],
    //     });
    //     if (data.凤凰 === undefined) data.凤凰 = [];
    //     data.凤凰.push(boss.combatants[0]);
    //     console.log(data.凤凰);
    //   },
    //   alertText: (data, matches, output) => {
    //     if (data.凤凰.length == 2) {
    //       let 方位 = ['AC', 'BD', 'AC', 'BD'];
    //       let 方位1 = Math.round(Math.round(2 - 2 * Math.atan2(data.凤凰[0].PosX - 100, data.凤凰[0].PosY - 100) / Math.PI) % 4);
    //       let 方位2 = Math.round(Math.round(2 - 2 * Math.atan2(data.凤凰[1].PosX - 100, data.凤凰[1].PosY - 100) / Math.PI) % 4);
    //       let bobao = [];
    //       console.log(data.凤凰);
    //       console.log(方位1 + ':' + 方位2);
    //       if (方位1 <= 方位2) {
    //         bobao.push(方位[方位1]);
    //         bobao.push(方位[方位2]);
    //       }
    //       if (方位 > 方位2) {
    //         bobao.push(方位[方位2]);
    //         bobao.push(方位[方位1]);
    //       }
    //       return bobao[0] + bobao[1]
    //     }
    //   },
    // },
    // {
    //   id: '分身',
    //   type: 'StartsUsing',
    //   netRegex: NetRegexes.startsUsing({ id: ['7950', '7951'] }),
    //   delaySeconds: 0.5,
    //   suppressSeconds: 1,
    //   promise: async (data, matches) => {
    //     data.combatantData = [];
    //     data.combatantData = (await callOverlayHandler({
    //       call: 'getCombatants',
    //       ids: [parseInt(matches.sourceId, 16)],
    //     })).combatants;
    //   },
    //   alertText: (data, matches, output) => {
    //     let dir = matchedPositionTo4Dir(data.combatantData[0])
    //     data.illuCount++
    //     if (data.illuCount == 1) {
    //       if ((dir == 0 || dir == 2) && matches.id == "7950") { // ac尾巴
    //         return "BD安全"
    //       } else if ((dir == 1 || dir == 3) && matches.id == "7951") { // bd翅膀
    //         return "BD安全"
    //       }
    //       return "AC安全"
    //     } else
    //       if (data.illuCount == 2) {
    //         // 翅膀
    //         if (matches.id == "7951") {
    //           return "内场安全"
    //         }
    //         return "外场安全"
    //       }
    //   }
    // },
    {
      id: 'P8S Illusory Hephaistos Scorched Pinion First',
      type: 'StartsUsing',
      // This is "Illusory Hephaistos" but sometimes it says "Gorgon".
      netRegex: NetRegexes.startsUsing({ id: '7953' }),
      condition: (data) => data.flareTargets.length === 0,
      suppressSeconds: 1,
      promise: async (data, matches) => {
        data.combatantData = [];
        const id = parseInt(matches.sourceId, 16);
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [id],
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        const combatant = data.combatantData[0];
        if (combatant === undefined || data.combatantData.length !== 1)
          return;
        const dir = positionTo8Dir(combatant);
        if (dir === 0 || dir === 4)
          return output.northSouth();
        if (dir === 2 || dir === 6)
          return output.eastWest();
      },
      outputStrings: {
        northSouth: {
          en: 'North/South Bird',
          de: 'Norden/Süden Vogel',
          ja: '南北フェニックス',
          cn: 'AC安全'
        },
        eastWest: {
          en: 'East/West Bird',
          de: 'Osten/Westen Vogel',
          ja: '東西フェニックス',
          cn: 'BD安全'
        },
      },
    },
    {
      id: 'P8S Nest of Flamevipers',
      type: 'StartsUsing',
      // During clones.
      netRegex: NetRegexes.startsUsing({ id: '791F' }),
      alertText: (data, _matches, output) => {
        if (data.illusory === 'bird')
          return output.inAndProtean();
        if (data.illusory === 'snake')
          return output.outAndProtean();
        // This shouldn't happen, but just in case.
        return output.protean();
      },
      run: (data) => delete data.illusory,
      outputStrings: {
        inAndProtean: {
          en: 'In + Protean',
          de: 'Rein + Himmelsrichtung',
          ja: '内側 + 散会',
          cn: '内侧分散'
        },
        outAndProtean: {
          en: 'Out + Protean',
          de: 'Raus + Himmelsrichtung',
          ja: '外側 + 散会',
          cn: '外侧分散'
        },
        protean: {
          en: 'Protean',
          de: 'Himmelsrichtung',
          ja: '散会',
          cn: '分散'
        },
      },
    },
    {
      id: 'P8S Illusory Hephaistos Scorched Pinion Second',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7953' }),
      condition: (data) => data.flareTargets.length > 0,
      suppressSeconds: 1,
      run: (data) => data.illusory = 'bird',
    },
    {
      id: 'P8S Illusory Hephaistos Scorching Fang Second',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7952' }),
      condition: (data) => data.flareTargets.length > 0,
      suppressSeconds: 1,
      run: (data) => data.illusory = 'snake',
    },
    {
      id: 'P8S Tetraflare',
      type: 'StartsUsing',
      // During vents and also during clones.
      netRegex: NetRegexes.startsUsing({ id: '791E' }),
      alertText: (data, _matches, output) => {
        if (data.illusory === 'bird')
          return output.inAndStacks();
        if (data.illusory === 'snake')
          return output.outAndStacks();
        return output.stacks();
      },
      run: (data) => delete data.illusory,
      outputStrings: {
        inAndStacks: {
          en: 'In + Stacks',
          de: 'Rein + Sammeln',
          ja: '内側 + 頭割り',
          cn: '内侧分摊'
        },
        outAndStacks: {
          en: 'Out + Stacks',
          de: 'Raus + Sammeln',
          ja: '外側 + 頭割り',
          cn: '外侧分摊'
        },
        stacks: {
          en: 'Partner Stacks',
          de: 'Mit Partner sammeln',
          ja: '2人頭割り',
          cn: '2人分摊'
        },
      },
    },
    {
      id: 'P8S Quadrupedal Impact',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A04' }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Follow Jump',
          de: 'Sprung folgen',
          ja: '近づく',
          cn: '靠近击退'
        },
      },
    },
    {
      id: 'P8S Quadrupedal Crush',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A05' }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away From Jump',
          de: 'Weg vom Sprung',
          ja: '離れる',
          cn: '远离钢铁',
        },
      },
    },
    // ---------------- Part 2 ----------------

    {
      id: 'P8S Aioniopyr',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79DF' }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'aoe + bleed',
          de: 'AoE + Blutung',
          ja: 'AOE + 出血',
          ko: '전체 공격 + 도트',
          cn: 'AOE+流血',
        },
      },
    },
    {
      id: 'P8S fourtower',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79DC' }),
      run: (data, matches) => {
        if (data.fourTower === undefined) data.fourTower = [];
        data.fourTower.push({ x: matches.x, y: matches.y });
        if (data.fourTower.length == 4) {
          data.fourTower.sort((a, b) => {
            return a.x - b.x
          });
          let waymark = {
            One: {
              X: data.fourTower[0].x,
              Y: matches.z,
              Z: data.fourTower[0].y,
              Active: true
            },
            Two: {
              X: data.fourTower[1].x,
              Y: matches.z,
              Z: data.fourTower[1].y,
              Active: true
            },
            Three: {
              X: data.fourTower[2].x,
              Y: matches.z,
              Z: data.fourTower[2].y,
              Active: true
            },
            Four: {
              X: data.fourTower[3].x,
              Y: matches.z,
              Z: data.fourTower[3].y,
              Active: true
            },
          };
          callOverlayHandler({ call: 'PostNamazu', c: 'place', p: JSON.stringify(waymark) })
        };
      },
    },
    {
      id: 'P8S 四人塔删除',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79DC' }),
      suppressSeconds: 3,
      delaySeconds: 3,
      run: (data) => {
        delete data.fourTower;
      },
    },
    {
      id: 'P8S 标点记录',
      type: 'StartsUsing',
      suppressSeconds: 9999,
      delaySeconds: 2,
      netRegex: NetRegexes.startsUsing({ id: '79DF' }),
      run: () => {
        originalMark = camera;
      },
    },
    {
      id: 'P8S 恢复标点',
      type: 'StartsUsing',
      suppressSeconds: 99999,
      netRegex: NetRegexes.startsUsing({ id: '79DF' }),
      
      run: () => {

        if (originalMark != undefined && originalMark.A.X != 0) {
          callOverlayHandler({ call: 'PostNamazu', c: 'place', p: JSON.stringify(originalMark) });
        }
      },
    },
    {
      id: 'P8S Tyrant\'s Fire III Counter',
      type: 'Ability',
      netRegex: { id: '75F0' },
      preRun: (data) => data.burstCounter++,
      durationSeconds: 2,
      suppressSeconds: 1,
      sound: '',
      infoText: (data, _matches, output) => output.text({ num: data.burstCounter }),
      tts: null,
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '${num}番',
          cn: '${num}',
          ko: '${num}',
        },
      },
    },
    {
      id: 'p8S塔id',
      type: 'MapEffect',
      netRegex: /] ChatLog 00:0:103:.{8}:800375AB:00020001:.{6}(?<location>.+?):/,
      alertText: (data, matches) => {
        let towerPos = parseInt(matches.location, 16)
        if (data.towerPos === undefined) data.towerPos = [];
        if (data.myTower) {
          
        data.towerPos.push(towerPos);
        }
        
        let bobao;

        if (data.myTower && data.towerPos.length == 4) {
          delete data.myTower;
          let myPosX = data.myCombant.combatants[0].PosX;
          data.towerPos.forEach(i => {
            if (myPosX < 100) {
              switch (i) {
                case 76:
                  bobao = '左边第一排第一个'
                  break;
                case 77:
                  bobao = '左边第一排第二个'
                  break;
                case 80:
                  bobao = '左边第二排第一个'
                  break;
                case 82:
                  bobao = '左边第三排第二个'
                  break;
                case 11:
                  bobao = '左边第三排第二个'
                  break;
                default:
                  break;
              }
            }
            else {
              switch (i) {
                case 78:
                  bobao = '右边第一排第二个'
                  break;
                case 79:
                  bobao = '右边第一排第一个'
                  break;
                case 81:
                  bobao = '右边第二排第一个'
                  break;
                case 83:
                  bobao = '右边第三排第一个'
                case 12:
                  bobao = '右边第三排第二个'
                  break;
                case 10:
                  bobao = '右边第二排第二个'
                  break;
                default:
                  break;
              }
              let 第几列 = Math.floor(i / 4) + 1;
              let 第几排 = i % 4 + 1;
              console.log(i);
              console.log(data.towerPos);
              // if (Math.floor(i / 2)%2==0&&myPosX<100) {
              //   bobao= '塔'+'第'+第几排+'排'+第几列+'个'
              //   return '左边塔'+''+第几排+''+第几列
              // }
              // if (Math.floor(i / 2)%2!==0&&myPosX>100) {
              //   bobao= '塔'+'第'+第几排+'排'+第几列+'个'
              //   return '右边塔'+''+第几排+''+第几列
              // }
            }
          });
          return bobao
        }
        if (data.towerPos.length >= 4) {
          delete data.towerPos;
        }

      },
    },
    {
      id: 'P8S Tyrant\'s Fire III Bait then Tower',
      type: 'Ability',
      netRegex: { id: '75F0' },
      condition: Conditions.targetIsYou(),
      durationSeconds: 7.9,
      alertText: (data, _matches, output) => output.text({ num: data.burstCounter }),
      promise: async (data, matches) => {
        data.myCombant = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        });


      },
      run: (data) => data.myTower = data.burstCounter,
      outputStrings: {
        text: {
          en: '${num}',
          de: '${num}',
          fr: '${num}',
          ja: '自分: ${num}番',
          ko: '${num}',
          cn: '${num}',
        },
      },
    },
    {
      id: 'P8S Tyrant\'s Unholy Darkness',
      type: 'StartsUsing',
      // Untargeted, with 79DE damage after.
      netRegex: NetRegexes.startsUsing({ id: '79DD' }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Split Tankbusters',
          de: 'Geteilter Tankbuster',
          ja: '2人同時タンク強攻撃',
          ko: '따로맞는 탱버',
          cn: '双T死刑',
        },
      },
    },
    {
      id: 'P8S Ashing Blaze Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79D7' }),
      alertText: (data, _matches, output) => {
        if (data.firstAlignmentSecondAbility === 'stack')
          return output.rightAndStack();
        if (data.firstAlignmentSecondAbility === 'spread')
          return output.rightAndSpread();
        return output.right();
      },
      run: (data) => delete data.firstAlignmentSecondAbility,
      outputStrings: {
        right: Outputs.right,
        rightAndSpread: {
          en: 'Right + Spread',
          ko: '오른쪽 + 산개',
          cn: '右边分散',
        },
        rightAndStack: {
          en: 'Right + Stack',
          ko: '오른쪽 + 쉐어',
          cn: '右边分摊',
        },
      },
    },
    {
      id: 'P8S Ashing Blaze Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79D8' }),
      alertText: (data, _matches, output) => {
        if (data.firstAlignmentSecondAbility === 'stack')
          return output.leftAndStack();
        if (data.firstAlignmentSecondAbility === 'spread')
          return output.leftAndSpread();
        return output.left();
      },
      run: (data) => delete data.firstAlignmentSecondAbility,
      outputStrings: {
        left: Outputs.left,
        leftAndSpread: {
          en: 'Left + Spread',
          ko: '왼쪽 + 산개',
          cn: '左边分散',
        },
        leftAndStack: {
          en: 'Left + Stack',
          ko: '왼쪽 + 쉐어',
          cn: '左边分摊',
        },
      },
    },
    {
      id: 'P8S High Concept',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79AC' }),
      response: Responses.bigAoe(),
      run: (data) => {
        data.concept = {};
        data.splicer = {};
      },
    },
    {
      id: 'P8S Inverse Magics',
      type: 'GainsEffect',
      // This gets recast a lot on the same people, but shouldn't cause an issue.
      // This also only happens once on the second time through, so no need to reset.
      netRegex: NetRegexes.gainsEffect({ effectId: 'D15' }),
      infoText: (data, matches, output) => {
        if (!data.inverseMagics[matches.target])
          return output.reversed({ player: nametocnjob(matches.target, data) });
      },
      run: (data, matches) => data.inverseMagics[matches.target] = true,
      outputStrings: {
        reversed: {
          en: '${player} reversed',
          ko: '${player} 반전',
          cn: '${player} 颠倒',
        },
      },
    },
    {
      id: 'P8S Natural Alignment Purple on You',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '9F8', count: '209' }),
      preRun: (data, matches) => data.alignmentTargets.push((nametocnjob(matches.target, data))),
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'Alignment on YOU',
          ko: '원판 대상자',
          cn: '瞄准你',
        },
      },
    },
    {
      id: 'P8S Natural Alignment Purple Targets',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '9F8', count: '209', capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 5,
      sound: '',
      infoText: (data, _matches, output) => {
        const [name1, name2] = data.alignmentTargets.sort();
        return output.text({ player1: data.ShortName(name1), player2: data.ShortName(name2) });
      },
      tts: null,
      run: (data) => data.alignmentTargets = [],
      outputStrings: {
        text: {
          en: 'Alignment on ${player1}, ${player2}',
          ko: '${player1}, ${player2} 원판',
          cn: '瞄准了 ${player1}, ${player2}',
        },
      },
    },
    {
      id: 'P8S Illusory Hephaistos End of Days',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A8B' }),
      infoText: (_data, matches, output) => {
        // Illusory Hephaistos are at x=(80 or 120), y=(85 or 95 or 105 or 115).
        // Either the first or second row is always free.
        const y = parseFloat(matches.y);
        const epsilon = 2;
        const row1y = 85;
        const row2y = 95;
        // TODO: combine this with the ice/fire/stack/spread calls too?
        if (Math.abs(y - row1y) < epsilon)
          return output.row2();
        if (Math.abs(y - row2y) < epsilon)
          return output.row1();
      },
      outputStrings: {
        row1: {
          en: 'Front Row',
          de: 'Vordere Reihe',
          cn: '第一行安全',
        },
        row2: {
          en: 'Second Row',
          de: 'Zweite Reihe',
          cn: '第二行安全',
        },
      },
    },
    {
      id: 'P8S Natural Alignment First',
      type: 'GainsEffect',
      // This is a magic effectId with a statusloopvfx count, like 808 elsewhere.
      netRegex: NetRegexes.gainsEffect({ effectId: '9F8' }),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          ice: {
            en: 'Ice Groups First',
            ko: '얼음 쉐어 먼저',
            cn: '首先双分摊',
          },
          fire: {
            en: 'Fire Partners First',
            ko: '불 2인쉐어 먼저',
            cn: '首先三分摊',
          },
          stack: {
            en: 'Stack First',
            ko: '쉐어 먼저',
            cn: '首先分摊',
          },
          spread: {
            en: 'Spread First',
            ko: '산개 먼저',
            cn: '首先散开',
          },
          baitAndStack: {
            en: 'Bait => Stack',
            ko: '장판 유도 => 쉐어',
            cn: '诱导 => 分摊',
          },
          baitAndSpread: {
            en: 'Bait => Spread',
            ko: '장판 유도 => 산개',
            cn: '诱导 => 分散',
          },
        };
        const isReversed = data.inverseMagics[matches.target] === true;
        const id = matches.count;
        // Huge credit to Aya for this.  Also note `209` is the purple swirl.
        const ids = {
          fireThenIce: '1DC',
          iceThenFire: '1DE',
          stackThenSpread: '1E0',
          spreadThenStack: '1E2',
        };
        // The first time through, use the "bait" version to avoid people running off
        // as soon as they hear the beepy boops.
        if (!data.seenFirstAlignmentStackSpread) {
          // The first one can't be reversed.
          // Store the follow-up ability so it can be used with the left/right Ashing Blaze.
          if (id === ids.stackThenSpread) {
            data.firstAlignmentSecondAbility = 'spread';
            return { alertText: output.baitAndStack() };
          }
          if (id === ids.spreadThenStack) {
            data.firstAlignmentSecondAbility = 'stack';
            return { alertText: output.baitAndSpread() };
          }
        }
        const key = isReversed ? 'alarmText' : 'alertText';
        if (!isReversed && id === ids.fireThenIce || isReversed && id === ids.iceThenFire)
          return { [key]: output.fire() };
        if (!isReversed && id === ids.iceThenFire || isReversed && id === ids.fireThenIce)
          return { [key]: output.ice() };
        if (!isReversed && id === ids.spreadThenStack || isReversed && id === ids.stackThenSpread)
          return { [key]: output.spread() };
        if (!isReversed && id === ids.stackThenSpread || isReversed && id === ids.spreadThenStack)
          return { [key]: output.stack() };
      },
    },
    {
      id: 'P8S Natural Alignment Second',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['79C0', '79BF', '79BD', '79BE'], source: 'Hephaistos' }),
      suppressSeconds: 8,
      alertText: (data, matches, output) => {
        // Due to the way suppress works, put this check here and not in the condition field.
        // This callout will get merged with the left/right which happens at the same time.
        if (!data.seenFirstAlignmentStackSpread)
          return;
        const id = matches.id;
        const ids = {
          spread: '79C0',
          stack: '79BF',
          fire: '79BD',
          ice: '79BE',
        };
        // TODO: Should the left/right call (or some future "front row"/"2nd row") call be combined
        // with the followup here?
        if (id === ids.spread)
          return output.stack();
        if (id === ids.stack)
          return output.spread();
        if (id === ids.ice)
          return output.fire();
        if (id === ids.fire)
          return output.ice();
      },
      run: (data) => data.seenFirstAlignmentStackSpread = true,
      outputStrings: {
        stack: Outputs.stackMarker,
        spread: Outputs.spread,
        ice: {
          en: 'Ice Groups',
          ko: '얼음 그룹 쉐어',
          cn: '左右双分摊',
        },
        fire: {
          en: 'Fire Partners',
          ko: '불 2인 쉐어',
          cn: '三分摊',
        },
      },
    },
    {
      id: 'P8S High Concept Collect',
      // D02 = Imperfection Alpha
      // D03 = Imperfection Beta
      // D04 = Imperfection Gamma
      // D11 = Solosplice
      // D12 = Multisplice
      // D13 = Supersplice
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['D0[2-4]', 'D1[1-3]'] }),
      run: (data, matches) => {
        const id = matches.effectId;
        // 8 and 26s second debuffs.
        const isLong = parseFloat(matches.duration) > 10;
        let 人物 = nametocnjob(matches.target, data);
        if (id === 'D02')
          data.concept[人物] = isLong ? 'longalpha' : 'shortalpha';
        else if (id === 'D03')
          data.concept[人物] = isLong ? 'longbeta' : 'shortbeta';
        else if (id === 'D04')
          data.concept[人物] = isLong ? 'longgamma' : 'shortgamma';
        else if (id === 'D11')
          data.splicer[人物] = 'solosplice';
        else if (id === 'D12')
          data.splicer[人物] = 'multisplice';
        else if (id === 'D13')
          data.splicer[人物] = 'supersplice';
      },
    },
    {
      id: 'P8S High Concept Debuffs',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['D0[2-4]', 'D1[1-3]'], capture: false }),
      tts: null,
      delaySeconds: 0.5,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          noDebuff: {
            en: 'No Debuff',
            ko: '디버프 없음',
            cn: '没buff',
          },
          shortAlpha: {
            en: 'Short Alpha',
            ko: '짧은 알파',
            cn: '短阿尔法',
          },
          longAlpha: {
            en: 'Long Alpha',
            ko: '긴 알파',
            cn: '长阿尔法',
          },
          longAlphaSplicer: {
            en: 'Long Alpha + ${splicer}',
            ko: '긴 알파 + ${splicer}',
            cn: '阿尔法+ ${splicer}',
          },
          shortBeta: {
            en: 'Short Beta',
            ko: '짧은 베타',
            cn: '短贝塔',
          },
          longBeta: {
            en: 'Long Beta',
            ko: '긴 베타',
            cn: '长贝塔',
          },
          longBetaSplicer: {
            en: 'Long Beta + ${splicer}',
            ko: '긴 베타 + ${splicer}',
            cn: '长贝塔+ ${splicer}',
          },
          shortGamma: {
            en: 'Short Gamma',
            ko: '짧은 감마',
            cn: '短伽马',
          },
          longGamma: {
            en: 'Long Gamma',
            ko: '긴 감마',
            cn: '长伽马',
          },
          longGammaSplicer: {
            en: 'Long Gamma + ${splicer}',
            ko: '긴 감마 + ${splicer}',
            cn: '长伽马 + ${splicer}',
          },
          soloSplice: {
            en: 'Solo Stack',
            ko: '1인징',
            cn: '单人分摊',
          },
          multiSplice: {
            en: 'Two Stack',
            ko: '2인징',
            cn: '双人分摊',
          },
          superSplice: {
            en: 'Three Stack',
            ko: '3인징',
            cn: '三人分摊',
          },
        };
        // General thought here: alarm => EXPLOSION GO, alert/info => go to safe corner
        let meJob = nametocnjob(data.me, data);
        data.运动会次数++;
        const concept = data.concept[meJob];
        const splicer = data.splicer[meJob];
        const singleConceptMap = {
          shortalpha: output.shortAlpha(),
          longalpha: output.longAlpha(),
          shortbeta: output.shortBeta(),
          longbeta: output.longBeta(),
          shortgamma: output.shortGamma(),
          longgamma: output.longGamma(),
        };
        data.secondBuff = concept;
        if (splicer === undefined) {
          if (concept === undefined) {
            data.myBuff = 'noBuff'
            return { alarmText: output.noDebuff() };
          }
          const isShort = concept === 'shortalpha' || concept === 'shortbeta' || concept === 'shortgamma';
          const conceptStr = singleConceptMap[concept];
          data.myBuff = concept;
          if (isShort)
            return { alarmText: conceptStr };
          return { alertText: conceptStr };
        }
        data.myBuff = splicer;
        const splicerMap = {
          solosplice: output.soloSplice(),
          multisplice: output.multiSplice(),
          supersplice: output.superSplice(),
        };
        const splicerStr = splicerMap[splicer];
        if (concept === undefined) {

          return { infoText: splicerStr };
        }

        else if (concept === 'longalpha')
          return { alertText: output.longAlphaSplicer({ splicer: splicerStr }) };
        else if (concept === 'longbeta')
          return { alertText: output.longBetaSplicer({ splicer: splicerStr }) };
        else if (concept === 'longgamma')
          return { alertText: output.longGammaSplicer({ splicer: splicerStr }) };
        // If we get here then we have a short concept with a splicer which shouldn't be possible,
        // but at least return *something* just in case.
        return { alarmText: singleConceptMap[concept] };
      },
    },
    {
      id: 'P8S头上图标',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['D0[5-7]'] }),
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {

        const id = matches.effectId;
        if (id === 'D05')
          data.图标 = 'alpha';
        else if (id === 'D06')
          data.图标 = 'beta';
        else if (id === 'D07')
          data.图标 = 'gamma';
      },
    },
    {
      id: 'P8S头上图标删除',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['D0[5-7]'] }),
      delaySeconds: 11,
      condition: Conditions.targetIsYou(),
      run: (data, matches) => {
        data.图标 = '';
      },
    },
    {
      id: 'P8S BUFF第二次行动',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['D0[2-4]', 'D1[1-3]'], capture: false }),
      delaySeconds: 0.9,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.运动会次数 <= 1) {
          if (data.myBuff == 'shortalpha') return '去A'
          if (data.myBuff == 'shortbeta') return '去B'
          if (data.myBuff == 'shortgamma') return '去C'
          if (data.myBuff == 'multisplice') return '去D上'
          if (data.myBuff == 'supersplice') return '去D下'
          if (data.myBuff == 'solosplice') return '去D上分摊'
          if (data.myBuff == 'longbeta') return '去D下分摊'
          if (data.myBuff == 'longalpha') return '去D上分摊'
          if (data.myBuff == 'longgamma') return '去D下分摊'
        }


      }
    },
    {
      id: '塔属性',
      netRegex: /] ChatLog 00:0:103:.{8}:800375AB:00020001:000000(?<index>.+?):/,
      suppressSeconds: 15,
      delaySeconds: 0.3,
      alertText: (data, matches, output) => {
        let tower = parseInt(matches.index, 16)
        if (tower >= 26 && tower <= 35) data.tower = '紫'
        if (tower >= 36 && tower <= 45) data.tower = '蓝'
        if (tower >= 46 && tower <= 55) data.tower = '绿'
        if (tower >= 26 && tower <= 55) data.塔次数++;
        if (data.tower && data.图标 && data.塔次数 <= 2) {
          if (data.tower == '紫') {

            if (data.图标 == 'beta') return '找人合成'
            if (data.图标 == 'gamma') return '找人合成'

          }
          if (data.tower == '蓝') {
            if (data.图标 == 'gamma') return '找人合成'
            if (data.图标 == 'alpha') return '找人合成'
          }
          if (data.tower == '绿') {
            if (data.图标 == 'beta') return '找人合成'
            if (data.图标 == 'alpha') return '找人合成'
          }
        }
        if (data.塔次数 == 1 && data.tower) {
          if (data.myBuff == 'longalpha') return '准备去A'
          if (data.myBuff == 'longbeta') return '准备去B'
          if (data.myBuff == 'longgamma') return '准备去C'
          if (data.tower == '紫') {
            if (data.myBuff == 'shortalpha') return '原地'
            if (data.myBuff == 'multisplice') return '去B'
            if (data.myBuff == 'supersplice') return '去C'
          }
          if (data.tower == '蓝') {
            if (data.myBuff == 'shortbeta') return '原地'
            if (data.myBuff == 'multisplice') return '去A'
            if (data.myBuff == 'supersplice') return '去C'
          }
          if (data.tower == '绿') {
            if (data.myBuff == 'shortgamma') return '原地'
            if (data.myBuff == 'multisplice') return '去A'
            if (data.myBuff == 'supersplice') return '去B'
          }
        }
        if (data.塔次数 == 3) {
          if (data.myBuff == 'noBuff') return '准备贴贴合成'
          if (data.tower == '紫') {
            if (data.myBuff == 'shortalpha') { data.移动 = true; return '原地' }
            if (data.图标 == 'beta') return '找人合成'
            if (data.图标 == 'gamma') return '找人合成'
          }
          if (data.tower == '蓝') {
            if (data.myBuff == 'shortbeta') { data.移动 = true; return '原地' }
            if (data.图标 == 'gamma') return '找人合成'
            if (data.图标 == 'alpha') return '找人合成'
          }
          if (data.tower == '绿') {
            if (data.myBuff == 'shortgamma') { data.移动 = true; return '原地' }
            if (data.图标 == 'beta') return '找人合成'
            if (data.图标 == 'alpha') return '找人合成'
          }

          if (data.secondBuff == 'longalpha') return '去A'
          if (data.secondBuff == 'longbeta') return '去B'
          if (data.secondBuff == 'longgamma') return '去C'

        }
        if (data.塔次数 == 4 && data.tower) {
          if (data.secondBuff == 'longalpha') return '左边合成后中间踩塔'
          if (data.secondBuff == 'longbeta') return '左边合成后中间踩塔'
          if (data.secondBuff == 'longgamma') return '右边合成后中间踩塔'
          if (data.移动) return '右边合成后中间踩塔'
          if (data.myBuff == 'noBuff') return '去左右顺时针引导鸟'
          return '去上下引导鸟'
        }
      }
    },
    {
      id: 'P8S Tyrant\'s Flare II Soak Tower',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A88', source: 'Hephaistos', capture: false }),
      preRun: (data) => data.flareCounter++,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.flareCounter === data.myTower)
          return output.text({ num: data.myTower });
      },
      outputStrings: {
        text: {
          en: 'Soak Tower ${num}',
          cn: '${num}塔',
          de: 'Turm ${num} nehmen',
          fr: 'Prenez la tour ${num}',
          ko: '${num}번째 기둥 밟기',
        },
      },
    },
    {
      id: '塔属性删除',
      netRegex: /] ChatLog 00:0:103:.{8}:800375AB:00020001:000000(?<index>.+?):/,
      suppressSeconds: 15,
      delaySeconds: 10,
      run: (data, matches, output) => {
        if (data.tower) {
          delete data.tower;
        }
        
      },

    },
    {
      id: 'P8S第二次运动会',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['D0[2-4]', 'D1[1-3]'], capture: false }),
      delaySeconds: 1,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (data.运动会次数 > 1) {
          if (data.myBuff == 'shortalpha') return '去A'
          if (data.myBuff == 'shortbeta') return '去B'
          if (data.myBuff == 'shortgamma') return '去C'
          if (data.myBuff == 'solosplice') return '去D上'
          if (data.myBuff == 'multisplice') return '去D下'
          if (data.myBuff == 'longalpha') return '去D下分摊'
          if (data.myBuff == 'longbeta') return '去D下分摊'
          if (data.myBuff == 'longgamma') return '去D下分摊'
          if (data.myBuff == 'noBuff') return '去A侧'
        }

      }
    },
    {
      id: 'P8S Limitless Desolation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75ED' }),
      response: Responses.spread('alert'),
    },
    {
      id: 'P8S Dominion',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79D9' }),
      response: Responses.spread('alert'),
      run: (data) => {
        delete data.第二轮塔;
        data.deformationTargets = []
      },
    },
    {
      id: 'P8S Orogenic Deformation Hit',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79DB' }),
      preRun: (data, matches) => data.deformationTargets.push(matches.target),
      infoText: (data, matches, output) => {
        if (data.me === matches.target) {
          data.第二轮塔 = true;
          return output.text();
        }
      },
      outputStrings: {
        text: {
          en: 'Second Towers',
          cn: '第二轮塔',
        },
      },
    },
    {
      id: '踩塔播报',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79DB' }),
      durationSeconds: 10,
      delaySeconds: 0.8,
      suppressSeconds: 3,
      infoText: (data, matches, output) => {
        let 第二轮塔 = [];
        for (let i = 0; i < 4; i++) {
          第二轮塔.push(nametocnjob(data.deformationTargets[i], data));

        }
        if (data.partJob === undefined) data.partJob = [];
        if (data.partJob.length<8)
        {
          for (let i = 0; i < 8; i++) {
          
            let job = nametocnjob(data.party.idToName_[data.party.partyIds_[i]], data);
            data.partJob.push(job);
          };
        }
        

        let 第一轮塔 = data.partJob.filter((i) => !第二轮塔.some((j) => j === i));
        第二轮塔.sort((a, b) => {
          return shunxu.find((c) => c.job == a).order - shunxu.find((c) => c.job == b).order
        });
        第一轮塔.sort((a, b) => {
          return shunxu.find((c) => c.job == a).order - shunxu.find((c) => c.job == b).order
        });
        if (data.第二轮塔) {
          return `第二轮塔${第二轮塔[0]} ${第二轮塔[1]} ${第二轮塔[2]} ${第二轮塔[3]}`
        }

        else {
          return `第一轮塔${第一轮塔[0]} ${第一轮塔[1]} ${第一轮塔[2]} ${第一轮塔[3]}`
        }
      },

    },

    {
      id: 'P8S Orogenic Deformation Not Hit',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '79DB' }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        if (!data.deformationTargets.includes(data.me))
          return output.text();
      },
      outputStrings: {
        text: {
          en: 'First Towers',
          cn: '第一轮塔',
        },
      },
    },
    {
      id: 'P8S Aionagonia',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7A22' }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'big aoe + bleed',
          ko: '아픈 전체공격 + 도트',
          cn: '大AOE+流血',
        },
      },
    },
    {
      id: 'P8S Perfected Alpha',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D0' }),
      disabled: true,
    },
    {
      id: 'P8S Perfected Beta',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D0' }),
      disabled: true,
    },
    {
      id: 'P8S Perfected Gamma',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D0' }),
      disabled: true,
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Conceptual Octaflare/Conceptual Tetraflare': 'Conceptual Octa/Tetraflare',
        'Emergent Octaflare/Emergent Tetraflare': 'Emergent Octa/Tetraflare',
      },
    },
    {
      'locale': 'de',
      'replaceSync': {
        'Hephaistos': 'Hephaistos',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Hephaistos': 'Héphaïstos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Hephaistos': '.*?',
      },
    },
  ],
});