


// 姓名 => 中文职业简称
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
const headmarkers = {
  'fentan': '01D1',
  'majiang1': '00E2',
  'majiang2': '00E3',
  'majiang3': '00E4',
  'majiang4': '00E5',
  'majiang5': '00E6',
  'majiang6': '00E7',
  'majiang7': '00E8',
  'majiang8': '00E9',
  '单分摊': '01F6',
  '单大圈': '01F7',
  '分摊连大圈': '01F8',
  '大圈连分摊': '01FA',
  '大圈连月环': '01FB',
  '月环连大圈': '01FD',
  '单月环': '0201',
  '黄圈分散': '00F8',
  '红圈分散': '01DB',
}
const 塔方位 = [

  {
    'weizhi': 1,
    'pos': [85, 85],
  },
  {
    'weizhi': 2,
    'pos': [95, 85],
  },
  {
    'weizhi': 3,
    'pos': [105, 85],
  },

  {
    'weizhi': 4,
    'pos': [115, 85],
  },
  {
    'weizhi': 5,
    'pos': [95, 95],
  },
  {
    'weizhi': 6,
    'pos': [105, 95],
  },
  {
    'weizhi': 7,
    'pos': [95, 105],
  },
  {
    'weizhi': 8,
    'pos': [105, 105],
  },
  {
    'weizhi': 9,
    'pos': [85, 115],
  },
  {
    'weizhi': 10,
    'pos': [95, 115],
  },
  {
    'weizhi': 11,
    'pos': [105, 115],
  },
  {
    'weizhi': 12,
    'pos': [115, 115],
  },
  {
    'weizhi': 13,
    'pos': [85, 105],
  },
  {
    'weizhi': 14,
    'pos': [115, 105],
  },
  {
    'weizhi': 15,
    'pos': [89, 95],
  },
  {
    'weizhi': 16,
    'pos': [115, 95],
  },

];
const crossTileFlags = '00020001'; // mapEffect flags for '+' tile effect
const diagonalTileFlags = '00400020'; // mapEffect flags for 'x' tile effect
const getHeadmarkerId = (data, matches, firstDecimalMarker) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 00DA.
  // (This makes the offset 0, and !0 is true.)
  if (data.decOffset === undefined) {
    // This must be set the first time this function is called in DSR Headmarker Tracker.
    if (firstDecimalMarker === undefined)
      throw new UnreachableCode();
    data.decOffset = parseInt(matches.id, 16) - firstDecimalMarker;
  }
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};


Options.Triggers.push({
  zoneId: 1084,
  //zoneId: ZoneId.MatchAll,
  overrideTimelineFile: true,
  timelineFile: "p6s.txt",
  initData: () => {
    return {
      鸳鸯锅: 0,
      tileTethers: [],
      mapEffects: [],
      polyInstance:0,
      darkSpheres: [],
    };
  },
  triggers: [
    // {
    //   id: 'P6S塔次数',
    //   type: 'StartsUsing',
    //   netRegex: NetRegexes.startsUsing({ id: ['7866', '7868'] }),
    //   run: (data, matches, output) => {
    //     data.unsafeMap = {
    //       0: ['左上角'],
    //       1: ['上侧偏左'],
    //       2: ['上侧偏右'],
    //       3: ['右上角'],
    //       4: ['左侧偏上'],
    //       5: ['内侧左上'],
    //       6: ['内侧右上'],
    //       7: ['右侧偏上'],
    //       8: ['左侧偏下'],
    //       9: ['内侧左下'],
    //       10: ['内侧右上'],
    //       11: ['右下偏下'],
    //       12: ['左下角'],
    //       13: ['下侧偏左'],
    //       14: ['下侧偏右'],
    //       15: ['右下角'],
    //     };
    //     data.changeTower={};
    //     data.塔次数++;
    //   }
    // },
    // {
    //   id: '塔播报',
    //   netRegex: /] ChatLog 00:0:103:.{8}:800375A9:(?<tower>.+?):.{7}(?<index>.+?):/,
    //   suppressSeconds:12,
    //   condition: (data, matches) => Boolean(data.unsafeMap),
    //   delaySeconds: 3,
    //   alertText: (data, matches, output) => {
    //     //delete data.塔位置;
    //     let boba='';
    //     const safVaules = Object.values(data.unsafeMap);
    //     for (let i = 0; i < safVaules.length; i++) {
    //      boba=boba+' '+safVaules[i]
          
    //     }
    //     delete data.unsafeMap;
    //     return boba
    //   },
    // },
    // {
    //   id: '第二次塔',
    //   netRegex: /] ChatLog 00:0:103:.{8}:800375A9:(?<tower>.+?):.{7}(?<index>.+?):/,
    //   condition: (data, matches) => Boolean(data.unsafeMap),
    //   delaySeconds:0.1,
    //   run: (data, matches, output) => {
    //     let 位置 = [parseInt(matches.index, 16)];
    //     if (位置 >= 1 && 位置 <= 16) {
    //       let 塔位置 = 塔方位.find((i) => i.weizhi == 位置).pos;
    //       let x = Math.floor((塔位置[0] - 85) / 10);
    //       let y = Math.floor((塔位置[1] - 85) / 10);
    //       let idx = x + y * 4;
          
    //       let ischange=false;

    //       if (data.changeTower.length>0) {
    //         data.changeTower.forEach(i => {
    //           if (Math.hypot(塔位置[0] - i.PosX, 塔位置[1] -  i.PosY)<=2) ischange=true;
    //         });
    //       }       
    //       //十字
    //       if ((matches.tower == '00020001'&&!ischange)||(ischange&&matches.tower == '00400020')) {
    //         for (let i = 0; i < 4; i++) {
    //           let y1 = y + i;
    //           let y2 = y - i;
    //           if (y1 <= 3) delete data.unsafeMap[x + y1 * 4];
    //           if (y2 >= 0) delete data.unsafeMap[x + y2 * 4];
    //           let x1 = x + i;
    //           let x2 = x - i;
    //           if (x1 <= 3) delete data.unsafeMap[x1 + y * 4];
    //           if (x2 >= 0) delete data.unsafeMap[x2 + y * 4];
    //         }
    //       }
    //        //叉字
    //       if ((matches.tower == '00400020'&&!ischange)||(ischange&&matches.tower == '00020001')) {

    //         for (let i = 0; i < 4; i++) {
    //           let idx1 = (x + i) + (y + i) * 4;
    //           let idx2 = (x - i) + (y - i) * 4;
    //           if (idx1 >= 0 && idx1 <= 15) delete data.unsafeMap[idx1];
    //           if (idx2 >= 0 && idx2 <= 15) delete data.unsafeMap[idx2];
    //         }

    //       }
    //     }
    //   },
    // },
    // {
    //   id: '塔绳子',
    //   type: 'Tether',
    //   condition: (data, matches) => Boolean(data.unsafeMap),
    //   netRegex: NetRegexes.tether(),
    //   promise: async (data, matches) => {
    //     const boss = await callOverlayHandler({
    //       call: 'getCombatants',
    //     });
    //     let sourceId=parseInt(matches.sourceId, 16);
    //     let targetId=parseInt(matches.targetId, 16);
    //     if (sourceId>0x40000000&&targetId>0x40000000) {
    //       let bossData1 = boss.combatants.filter((i)=>i.ID==sourceId)[0];
    //       let bossData2 = boss.combatants.filter((i)=>i.ID==targetId)[0];
    //       data.changeTower.push(bossData1);
    //       data.changeTower.push(bossData2);
    //     }
    //   },
    //   alertText: (data, matches, output) => {
       
    //   }
    // },
    // {
    //   id: '第五次塔',
    //   type: 'Tether',
    //   condition: (data, matches) => data.塔次数 == 5,
    //   suppressSeconds: 999,
    //   netRegex: NetRegexes.tether(),
    //   promise: async (data, matches) => {
    //     const boss = await callOverlayHandler({
    //       call: 'getCombatants',
    //     });
    //     console.log(boss.combatants);
    //     console.log(parseInt(matches.sourceId, 16));
    //     let bossData1 = boss.combatants.filter(i => i.ID == parseInt(matches.sourceId, 16))[0];
    //     let bossData2 = boss.combatants.filter(i => i.ID == parseInt(matches.targetId, 16))[0];
    //     let distance = Math.hypot(bossData1.PosX - bossData2.PosX, bossData1.PosY - bossData2.PosX);
    //     let distance1 = Math.hypot(bossData1.PosX - 100, bossData1.PosY - 100);
    //     let distance2 = Math.hypot(bossData2.PosX - 100, bossData2.PosY - 100);
    //     if (distance > 17) data.塔距离 = '长';
    //     if (distance < 17) data.塔距离 = '短';
    //     if (distance1 < 8) data.中间塔 = bossData1;
    //     if (distance2 < 8) data.中间塔 = bossData2;
    //   },
    //   alertText: (data, matches, output) => {
    //     if (data.塔距离 == '长') {
    //       return '靠近场边十字'
    //     }
    //     if (data.塔距离 == '短') {
    //       return '远离场边十字一格'
    //     }
    //   }
    // },
    
    {
      id: 'P6S Polyominoid Tether Collect',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '00CF' }),
      run: (data, matches) => {
        data.tileTethers.push(matches);
      },
    },
    {
      id: '塔id',
      type: 'MapEffect',
      netRegex: /] ChatLog 00:0:103:.{8}:800375A9:(?<flags>.+?):.{6}(?<location>.+?):/,
      run: (data, matches) => {
        if (matches.flags==crossTileFlags||matches.flags==diagonalTileFlags) {
          if (matches.location !== '00')
          data.mapEffects.push(matches);
        }
       
      },
    },
    {
      id: 'P6S Polyominoid MapEffect Collect',
      type: 'MapEffect',
      netRegex: { flags: [crossTileFlags, diagonalTileFlags] },
      run: (data, matches) => {

      },
    },
    {

      id: 'P6S Polyominoid All',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '786[68]' }),
      delaySeconds: 2, 
      durationSeconds: 10, 
      promise: async (data) => {
        data.combatantData = [];
        const ids = [];
        if (data.tileTethers.length !== 0) {
          for (const tether of data.tileTethers)
            ids.push(parseInt(tether.sourceId, 16), parseInt(tether.targetId, 16));
          let combatantData = (await callOverlayHandler({
            call: 'getCombatants',
            ids: ids,
          }));
          data.combatantData=combatantData.combatants;
        }
      },
      infoText: (data, _matches, output) => {
        data.polyInstance++;
  
        if (data.tileTethers.length > 0 && data.combatantData.length === 0)
        {
          console.log(data.polyInstance+'次没找到交换');
          return;
        }
       
        if (data.mapEffects.length < 2)
          return;
        if (data.polyInstance === 4) // lots of safe spots, doesn't need a trigger response
          return;

        const safe = {
          // This ordering matters for most Poly instances.
          insideNW: true,
          insideNE: true,
          insideSW: true,
          insideSE: true,
          cornerNW: true,
          cornerNE: true,
          cornerSW: true,
          cornerSE: true,
          outsideNNW: true,
          outsideNNE: true,
          outsideSSW: true,
          outsideSSE: true,
          outsideWNW: true,
          outsideENE: true,
          outsideWSW: true,
          outsideESE: true,
        };

      
        const unsafeMap= {
          0: ['01', 'cornerNW'],
          1: ['02', 'outsideNNW'],
          2: ['03', 'outsideNNE'],
          3: ['04', 'cornerNE'],

          10: ['0F', 'outsideWNW'],
          11: ['05', 'insideNW'],
          12: ['06', 'insideNE'],
          13: ['10', 'outsideENE'],

          20: ['0D', 'outsideWSW'],
          21: ['07', 'insideSW'],
          22: ['08', 'insideSE'],
          23: ['0E', 'outsideESE'],

          30: ['09', 'cornerSW'],
          31: ['0A', 'outsideSSW'],
          32: ['0B', 'outsideSSE'],
          33: ['0C', 'cornerSE'],
        };

        const mapLookup= Object.fromEntries(Object.entries(unsafeMap).map(([tile, [location]]) => [location, parseInt(tile, 10)]));


        const tetheredTiles = [];
        if (data.tileTethers.length >= 1) {
          for (const tile of data.combatantData) {
            // x, y = 85, 95, 105, 115 (with a little variance)
            // map to ([0, 1, 2, 3] and [0, 10, 20, 30]
            const x = Math.floor((tile.PosX - 83) / 10); // add in a -2/+8 buffer in case of goofy pos data
            const y = Math.floor((tile.PosY - 83) / 10) * 10; // add in a -2/+8 buffer in case of goofy pos data
            const idx = x + y;
            if (unsafeMap[idx] === undefined)
              return;
            tetheredTiles.push(idx);
          }
        }

        // modifiers used to calculate unsafeMap indexes to be removed for each type of tile
        const relCrossTiles = new Int8Array([-30, -20, -10, -3, -2, -1, 1, 2, 3, 10, 20, 30]);
        const relDiagonalTiles = new Int8Array([-33, -27, -22, -18, -11, -9, 9, 11, 18, 22, 27, 33]);

        for (const effect of data.mapEffects) {
          if (mapLookup[effect.location] === undefined)
            return;
          const startTile = mapLookup[effect.location];
          const isTethered = tetheredTiles.includes(startTile);
          if (unsafeMap[startTile] !== undefined)
            delete safe[unsafeMap[startTile][1]]; // delete tile where effect appears, as it will always be unsafe
          if (
            effect.flags === crossTileFlags && !isTethered ||
            effect.flags === diagonalTileFlags && isTethered
          ) {
            relCrossTiles.forEach((tileMod) => {
              const deleteTile = startTile + tileMod;
              if (unsafeMap[deleteTile] !== undefined)
                delete safe[unsafeMap[deleteTile][1]];
            });
          } else if (
            effect.flags === diagonalTileFlags && !isTethered ||
            effect.flags === crossTileFlags && isTethered
          ) {
            relDiagonalTiles.forEach((tileMod) => {
              const deleteTile = startTile + tileMod;
              if (unsafeMap[deleteTile] !== undefined)
                delete safe[unsafeMap[deleteTile][1]];
            });
          } else {
            return;
          }
        }

        const safeTiles= Object.keys(safe);
        const [safe0, safe1] = safeTiles;

        if (safe0 === undefined)
          return;

        const outsideFrontBackTiles = ['outsideNNW', 'outsideNNE', 'outsideSSW', 'outsideSSE'];
        const outsideSideTiles = ['outsideWNW', 'outsideENE', 'outsideWSW', 'outsideESE'];
        // establishes pairs of east/west tiles that will be safe during Poly 6
        const poly6Pairs= {
          insideNW: 'outsideSSW',
          insideNE: 'outsideSSE',
          insideSW: 'outsideNNW',
          insideSE: 'outsideNNE',
          cornerNW: 'outsideWSW',
          cornerNE: 'outsideESE',
          cornerSE: 'outsideENE',
          cornerSW: 'outsideWNW',
        };
        switch (data.polyInstance) {
          case 1: // four safe spots: two inside (east or west pair) and two outside (opposite east or west pair)
            if (safeTiles.length !== 4)
              return;
            if (safe0 === 'insideNW')
              return output.combo({ dir1: output.insideWest(), dir2: output.outsideEast() });
            else if (safe0 === 'insideNE')
              return output.combo({ dir1: output.insideEast(), dir2: output.outsideWest() });
            return;
          case 2: // one inside safe spot
            if (safeTiles.length !== 1 || output[safe0] === undefined)
              return;
            return output.single({ dir1: output[safe0]() });
          case 3: // two inside safe spots
            if (safeTiles.length !== 2 || safe1 === undefined || output[safe0] === undefined || output[safe1] === undefined)
              return;
            return output.combo({ dir1: output[safe0](), dir2: output[safe1]() });
          case 4: // here for completeness, but should never be run
            return;
          case 5: // two outside safe spots (reduced to one by Chorus Ixou)
          
            if (safeTiles.length !== 2 || safe1 === undefined)
              return;
             
            if ((outsideFrontBackTiles.includes(safe0)) && (outsideSideTiles.includes(safe1))) { // should be always true because of ordering
              data.poly5FrontBackTile = output[safe0]();
              data.poly5SideTile = output[safe1]();
              return; // success - output will be handled by Chorus Ixou trigger
            }
            return;
          case 6: // Cachexia 2 - four safe spots that form corners of a 3x3 tile sub-grid
            if (safeTiles.length !== 4 || safe1 === undefined || data.predationDebuff === undefined)
              return;
            // data.predationDebuff should be set by P6S Predation Debuff Collect
            // - CF7 Glossal Resistance Down (Snake Icon) (Left/west safe)
            // - CF8 Chelic Resistance Down (Wing Icon) (right/east safe)
            // for pol6, safe0 should always be an inside tile, and safe1 should always be a corner tile
            if (data.predationDebuff === 'CF7') {
              data.poly6SafeSide = output.left();
              if (safe0 === 'insideNW' || safe0 === 'insideSW') // inside + wall tile safe
                return output.poly6({ dir1: output.left(), dir2: output[safe0](), dir3: output[poly6Pairs[safe0]]() });
              else if (safe1 === 'cornerNW' || safe1 === 'cornerSW')
                return output.poly6({ dir1: output.left(), dir2: output[safe1](), dir3: output[poly6Pairs[safe1]]() });
              return;
            } else if (data.predationDebuff === 'CF8') {
              data.poly6SafeSide = output.right();
              if (safe0 === 'insideNE' || safe0 === 'insideSE') // inside + wall tile safe
                return output.poly6({ dir1: output.right(), dir2: output[safe0](), dir3: output[poly6Pairs[safe0]]() });
              else if (safe1 === 'cornerNE' || safe1 === 'cornerSE')
                return output.poly6({ dir1: output.right(), dir2: output[safe1](), dir3: output[poly6Pairs[safe1]]() });
              return;
            }
            return;
          case 7: // one inside safe spot
            if (safeTiles.length !== 1 || output[safe0] === undefined)
              return;
            return output.single({ dir1: output[safe0]() });
          case 8: // four safe spots: two inside (east or west pair) and two outside (opposite east or west pair)
            if (safeTiles.length !== 4)
              return;
            if (safe0 === 'insideNW')
              return output.combo({ dir1: output.insideWest(), dir2: output.outsideEast() });
            else if (safe0 === 'insideNE')
              return output.combo({ dir1: output.insideEast(), dir2: output.outsideWest() });
            return;
          default:
            return;
        }
      },
      run: (data) => {
        data.tileTethers = [];
        data.mapEffects = [];
        data.combatantData = [];
      },
      outputStrings: {
        combo: {
          en: '${dir1} / ${dir2}',
        },
        single: {
          en: '${dir1}',
        },
        poly6: {
          en: '${dir1}: ${dir2} / ${dir3}',
        },
        left: {
          en: '左',
        },
        right: {
          en: '右',
        },
        insideWest: {
          en: '里面左边',
        },
        insideEast: {
          en: '里面右边',
        },
        outsideWest: {
          en: '外面左边',
        },
        outsideEast: {
          en: '外面右边',
        },
        insideNW: {
          en: '里面左上',
        },
        insideNE: {
          en: '里面右上',
        },
        insideSE: {
          en: '里面右下',
        },
        insideSW: {
          en: '里面左下',
        },
        outsideNNW: {
          en: '上侧偏左',
        },
        outsideNNE: {
          en: '上侧偏右',
        },
        outsideSSW: {
          en: '下侧偏左',
        },
        outsideSSE: {
          en: '下侧偏右',
        },
        outsideWNW: {
          en: '右侧偏上',
        },
        outsideENE: {
          en: '左侧偏上',
        },
        outsideWSW: {
          en: '左侧偏下',
        },
        outsideESE: {
          en: '右侧偏下',
        },
        cornerNW: {
          en: '左上角',
        },
        cornerNE: {
          en: '右上角',
        },
        cornerSE: {
          en: '右下角',
        },
        cornerSW: {
          en: '左下角',
        },
      },
    },
    {
      id: 'P6S Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => {
        const firstHeadmarker = parseInt(headmarkers.fentan, 16);
        getHeadmarkerId(data, matches, firstHeadmarker);
      },
    },
    {
      id: 'P6S Hemitheos\'s Dark IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7860' }),
      suppressSeconds: 1,
      alertText: (data, matches, output) => {
        return 'AOE'
      }
    },
    {
      id: 'P6S Chelic Synergy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '788A' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'P6S Choros Ixou Front Back',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7883' }),
      response: Responses.goFrontBack(),
    },
    {
      id: 'P6S Choros Ixou Front Back',
      type: 'StartsUsing',
      netRegex: { id: '7883',  },
      alertText: (data, _matches, output) => {
        if (data.polyInstance === 5 && data.poly5FrontBackTile !== undefined)
          return output.goFrontBackPoly5({ tile: data.poly5FrontBackTile });
        return output.goFrontBack();
      },
      outputStrings: {
        goFrontBack: Outputs.goFrontBack,
        goFrontBackPoly5: {
          en: 'Go Front/Back (${tile})',
          de: 'Gehe nach Vorne/Hinten (${tile})',
          fr: 'Allez Devant/Derrière (${tile})',
          ja: '縦へ (${tile})',
          cn: '去前面/后面 (${tile})',
          ko: '앞/뒤로 (${tile})',
        },
      },
    },
    {
      id: 'P6S Choros Ixou Sides',
      type: 'StartsUsing',
      netRegex: { id: '7881'},
      alertText: (data, _matches, output) => {
        if (data.polyInstance === 5 && data.poly5SideTile !== undefined)
          return output.goSidesPoly5({ tile: data.poly5SideTile });
        return output.goSides();
      },
      outputStrings: {
        goSides: Outputs.sides,
        goSidesPoly5: {
          en: 'Sides (${tile})',
          de: 'Seiten (${tile})',
          fr: 'Côté (${tile})',
          ja: '横へ (${tile})',
          cn: '两侧 (${tile})',
          ko: '옆으로 (${tile})',
        },
      },
    },
    {
      id: 'P6S Polyominoid Healer Groups',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7892'}),
      // Should not be fired during Poly 1, since the Unholy Darkness headmarkers there
      // are handled by P6S Exocleaver Healer Groups.
      condition: (data) => data.polyInstance === 3,
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => '治疗分摊',
    },
    {
      id: 'P6S Synergy',
      type: 'StartsUsing',
      // There are 7889 individual starts using casts on the two tanks as well,
      // if this trigger wanted to be more complicated.
      netRegex: NetRegexes.startsUsing({ id: '7887' }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Split Tankbusters',
          de: 'Geteilter Tankbuster',
          cn: 'dot死刑',
        },
      },
    },
    {
      id: 'P6S Exchange of Agonies Markers',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      durationSeconds: 15,
      condition: (data, matches) => {
        return data.me === matches.target
      },
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id == headmarkers.majiang1) return '麻将1去左面第一个';
        if (id == headmarkers.majiang2) return '麻将2去右面第一个';
        if (id == headmarkers.majiang3) return '麻将3去左面第二个';
        if (id == headmarkers.majiang4) return '麻将4去右面第二个';
        if (id == headmarkers.majiang5) return '麻将5去左面第三个';
        if (id == headmarkers.majiang6) return '麻将6去右面第三个';
        if (id == headmarkers.majiang7) return '麻将7去左面第四个';
        if (id == headmarkers.majiang8) return '麻将8去右面第四个';
        if (id == headmarkers.单分摊) return '去中间分摊'
        if (id == headmarkers.单大圈) return '去外面放大圈'
        if (id == headmarkers.分摊连大圈) return '去外面放大圈'
        if (id == headmarkers.大圈连分摊) return '去中间分摊'
        if (id == headmarkers.大圈连月环) return '去中间放月环'
        if (id == headmarkers.月环连大圈) return '去外面放大圈'
        if (id == headmarkers.单月环) return '去中间放月环'
        if (id == headmarkers.黄圈分散) return '黄圈分散'
        if (id == headmarkers.红圈分散) return '红圈分散'
      },

    },
    {
      id: 'DSR Eyes Dive Counter',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['CF3', 'D48'], capture: true }),
      durationSeconds: 13,
      condition: Conditions.targetIsYou(),
      infoText: (data, matches, output) => {
        if (matches.effectId === 'CF3') return '面相场内'
        if (matches.effectId === 'D48') return '面相场外'
      }
    },
    {
      id: 'P6S Dark Dome Bait',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '788B' }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Circles',
          de: 'Kreise ködern',
          cn: '集合放黄圈',
        },
      },
    },
    {
      id: 'P6S Dark Dome Move',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['788B', '788C'] }),
      suppressSeconds: 5,
      response: Responses.moveAway(),
    },
    {
      id: 'P6S鸳鸯锅次数',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7876' }),
      run: (data, matches, output) => {
        data.鸳鸯锅++;
      }
    },
    
    {
      id: 'P6S Predation Debuff Collect',
      // CF7 Glossal Resistance Down (Snake Icon)
      // CF8 Chelic Resistance Down (Wing Icon)
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['CF7', 'CF8'] }),
      condition: Conditions.targetIsYou(),
      run: (data, matches) => data.predationDebuff = matches.effectId,
    },
    {
      id: 'P6S Predation Bait Order',
      // Using Aetheronecrosis (CF9)
      // These come out as 20s, 16s, 12s, or 8s
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'CF9' }),
      condition: Conditions.targetIsYou(),
      preRun: (data, matches) => data.aetheronecrosisDuration = parseFloat(matches.duration),
      delaySeconds: 0.1,
      durationSeconds: (_data, matches) => {
        const duration = parseFloat(matches.duration);
        // First Dual Predation is 3.7s before expiration
        // Remaining Dual Predations are 12.3s (second), 12.4s (third/fourth)
        return duration > 16 ? duration - 3.8 : duration + 12.3;
      },
      infoText: (data, matches, output) => {
        const duration = parseFloat(matches.duration);
        const dir = data.predationDebuff === 'CF7' ? output.left() : output.right();
        let numBait;
        // Allow for slight variation in duration
        if (duration <= 8) {
          numBait = output.secondBait();
        } else if (duration <= 12) {
          numBait = output.thirdBait();
        } else if (duration <= 16) {
          numBait = output.fourthBait();
        } else {
          // 20s
          numBait = output.firstBait();
        }
        return output.text({ dir: dir, bait: numBait });
      },
      outputStrings: {
        text: {
          en: '${dir}, ${bait}',
          de: '${dir}, ${bait}',
          fr: '${dir}, ${bait}',
          ja: '${dir}, ${bait}',
          cn: '${dir}, ${bait}',
          ko: '${dir}, ${bait}',
        },
        left: {
          en: 'Left (Wing Side)',
          de: 'Links (Flügel-Seite)',
          fr: 'Gauche (Côté Aile)',
          cn: '左',
          ja: '左 (翼)',
          ko: '왼쪽 (날개쪽)',
        },
        right: {
          en: 'Right (Snake Side)',
          de: 'Rechts (Schlangen-Seite)',
          fr: 'Droite (Côté Serpent)',
          cn: '右',
          ja: '右 (蛇)',
          ko: '오른쪽 (뱀쪽)',
        },
        firstBait: {
          en: 'First Bait (20s)',
          de: 'Köder als 1. (20s)',
          fr: 'Dépose en 1er (20s)',
          ja: '1番目 (20秒)',
          cn: '靠近引导第一次',
          ko: '유도 1번 (20초)',
        },
        secondBait: {
          en: 'Second Bait (8s)',
          de: 'Köder als 2. (8s)',
          fr: 'Dépose en 2ème (8s)',
          ja: '2番目 (8秒)',
          cn: '上侧引导第二次',
          ko: '유도 2번 (8초)',
        },
        thirdBait: {
          en: 'Third Bait (12s)',
          de: 'Köder als 3. (12s)',
          fr: 'Dépose en 3ème (12s)',
          ja: '3番目 (12秒)',
          cn: '外侧引导第三次',
          ko: '유도 3번 (12초)',
        },
        fourthBait: {
          en: 'Fourth Bait (16s)',
          de: 'Köder als 4. (16s)',
          fr: 'Dépose en 4ème (16s)',
          ja: '4番目 (16秒)',
          cn: '下边引导第四次',
          ko: '유도 4번 (16초)',
        },
      },
    },
    {
      id: 'P6S Predation In First Bait Reminder',
      // Using Dual Predation (7878)
      // Delayed to give roughly same notice interval as other bait reminders
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7878' }),
      condition: (data) => data.aetheronecrosisDuration > 16,
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 4,
      infoText: (_data, _matches, output) => output.inFirstBait(),
      outputStrings: {
        inFirstBait: {
          en: 'In (First Bait)',
          de: 'Rein (Köder als 1.)',
          fr: 'À l\'intérieur (1er)',
          ja: '内側へ (1番目)',
          cn: '靠近第一次引导',
          ko: '안으로 (유도 1번)',
        },
      },
    },
    {
      id: 'P6S Predation In Bait Reminder',
      // Using Chelic Predation (787B) and Glossal Predation (787A)
      // Player could get hit at wrong time and still get this trigger
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['787A', '787B'] }),
      durationSeconds: 4,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        data.predationCount = data.predationCount + 1;
        let countMap;
        // Allow for slight variation in duration
        if (data.aetheronecrosisDuration <= 8) {
          countMap = 1;
        } else if (data.aetheronecrosisDuration <= 12) {
          countMap = 2;
        } else if (data.aetheronecrosisDuration <= 16) {
          countMap = 3;
        } else {
          // 20s
          countMap = 0;
        }
        // Output for in players
        if (countMap === data.predationCount) {
          const inBaitMap = {
            1: output.inSecondBait(),
            2: output.inThirdBait(),
            3: output.inFourthBait(),
          };
          return inBaitMap[data.predationCount];
        }
      },
      outputStrings: {
        inSecondBait: {
          en: 'In (Second Bait)',
          de: 'Rein (Köder als 2.)',
          fr: 'À l\'intérieur (2ème)',
          ja: '内側へ (2番目)',
          cn: '靠近第二次引导',
          ko: '안으로 (유도 2번)',
        },
        inThirdBait: {
          en: 'In (Third Bait)',
          de: 'Rein (Köder als 3.)',
          fr: 'À l\'intérieur (3ème)',
          ja: '内側へ (3番目)',
          cn: '靠近第三次引导',
          ko: '안으로 (유도 3번)',
        },
        inFourthBait: {
          en: 'In (Fourth Bait)',
          de: 'Rein (Köder als 4.)',
          fr: 'À l\'intérieur (4ème)',
          ja: '内側へ (4番目)',
          cn: '靠近第四次引导',
          ko: '안으로 (유도 4번)',
        },
      },
    },
    {
      id: 'P6S Predation Out',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['787A', '787B'] }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.out(),
      outputStrings: {
        out: Outputs.out,
      },
    },
    {
      id: 'P6S Ptera Ixou',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['CF7', 'CF8'], capture: true }),
      durationSeconds: 6,
      suppressSeconds: 45,
      delaySeconds: (data, matches, output) => matches.duration - 1,
      condition: (data, matches, output) => Conditions.targetIsYou() && data.鸳鸯锅 == 1,
      infoText: (data, matches, output) => {
        let bobao=data.predationDebuff === 'CF7' ? '去左边' : '去右边';
        return bobao

      }
    },
    {
      id: '第二次鸳鸯锅',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['CF7', 'CF8'], capture: true }),
      durationSeconds: 6,
      suppressSeconds: 45,
      condition: (data, matches, output) => Conditions.targetIsYou() && data.鸳鸯锅 == 2,
      infoText: (data, matches, output) => {
        let bobao=data.predationDebuff === 'CF7' ? '去左边' : '去右边';
        return bobao
      }
    },
    {
      id: 'P6S Pathogenic Cells Counter',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D0' }),
      disabled: true,
      response: Responses.lookAway('alert'),
    },
    {
      id: 'P6S Dark Spheres Collect',
      type: 'StartsUsing',
      netRegex: { id: '7880' },
      run: (data, matches) => data.darkSpheres.push(matches),
    },
    {
      id: 'P6S Cachexia 2 Dark Spheres',
      type: 'StartsUsing',
      netRegex: { id: '7880' },
      delaySeconds: 0.5,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        for (const darkSphere of data.darkSpheres) {
          if (data.me === darkSphere.target)
            return data.poly6SafeSide === undefined
              ? output.spread()
              : output.spreadSide({ dir1: data.poly6SafeSide });
          return data.poly6SafeSide === undefined
            ? output.stack()
            : output.stackSide({ dir1: data.poly6SafeSide });
        }
      },
      outputStrings: {
        spread: Outputs.spread,
        stack: Outputs.stackMarker,
        spreadSide: {
          en: 'Spread ${dir1}',
          de: 'Verteilen ${dir1}',
          fr: 'Dispersion ${dir1}',
          ja: '散会 ${dir1}',
          cn: '散开 ${dir1}',
          ko: '산개 ${dir1}',
        },
        stackSide: {
          en: 'Stack ${dir1}',
          de: 'Sammeln ${dir1}',
          fr: 'Package ${dir1}',
          ja: '頭割り ${dir1}',
          cn: '分摊 ${dir1}',
          ko: '쉐어 ${dir1}',
        },
      },
    },
  ],

});
