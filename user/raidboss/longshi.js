// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
const headmarkers = {
  // vfx/lockon/eff/lockon6_t0t.avfx
  'hyperdimensionalSlash': '00EA',
  // vfx/lockon/eff/r1fz_firechain_01x.avfx through 04x
  'firechainCircle': '0119',
  'firechainTriangle': '011A',
  'firechainSquare': '011B',
  'firechainX': '011C',
  // vfx/lockon/eff/r1fz_skywl_s9x.avfx
  'skywardLeap': '014A',
  // vfx/lockon/eff/m0244trg_a1t.avfx and a2t
  'sword1': '0032',
  'sword2': '0033',
  // vfx/lockon/eff/r1fz_holymeteo_s12x.avfx
  'meteor': '011D',
  'majiang1': '013F',
  'majiang2': '0140',
  'majiang3': '0141',
  'lanbiao':'000E',
  'fuchong':'0014',
};
function nametocnjob(name,data){
  let re;
  switch (data.party.jobName(name)){
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
        re=name;
        break;
  };
  // 如果有重复职业，则播报职业+ID
  // t同职业
  if(data.party.roleToPartyNames_.tank[0] == data.party.roleToPartyNames_.tank[1]){
      return re + ' ' + data.ShortName(name);
  };
  // H同职业
  if(data.party.roleToPartyNames_.healer[0] == data.party.roleToPartyNames_.healer[1]){
      return re + ' ' + data.ShortName(name);
  };
  // DPS同职业
  for (let i=0;i < 3;i++ ) {
      for (let a=1 ; a < 4 ;a ++) {
          if (i==a){
              continue;
          };
          if(data.party.roleToPartyNames_.dps[i] == data.party.roleToPartyNames_.dps[a]){
              return re + ' ' + data.ShortName(name);
          };
      };       
  };
  // 没有同职业，播报职业
  return re;
};
let camera;
addOverlayListener("onPlayerControl", (e) => {
  camera=e.detail;
  //console.log(e.detail);
});
const getOneMark=()=>{
  let aPos=camera.ONE;
  if (!aPos.Active) {
    return undefined;
  }
  let 位置= Math.round(4 - 4 * Math.atan2(aPos.X-100, aPos.Z-100) / Math.PI) % 8;
  switch (位置) {
    case 1:
      return '右上'
      break;
    case 3:
      return '右下'
      break;
    case 5:
      return '左下'
      break;
    case 7:
      return '左上'
      break;
    default:
      break;
  }
}
let shunxu=[
  {
      'job':'白魔',
      'order':16
  },
  {
      'job':'占星',
      'order':17
  },
  {
    'job':'贤者',
    'order':18
 }, 
  {
      'job':'学者',
      'order':19
  },
  {
    'job':'战士',
    'order':12
 },
  {
      'job':'枪刃',
      'order':13
  },
  {
      'job':'黑骑',
      'order':14
  },
  {
      'job':'骑士',
      'order':15
  },
  {
      'job':'武士',
      'order':1
  },
  {
      'job':'武僧',
      'order':2
  },
  {
      'job':'镰刀',
      'order':3
  },
  {
      'job':'忍者',
      'order':4
  },
  {
    'job':'龙骑',
    'order':5
  },
  {
    'job':'黑魔',
    'order':6
  },
  {
    'job':'诗人',
    'order':7
  },
  {
    'job':'舞者',
    'order':8
  },
  {
    'job':'机工',
    'order':9
   }, 
   {
    'job':'召唤',
    'order':10
   },
   {
    'job':'赤魔',
    'order':11
   },
]; 
let shunxu2=[
  {
      'job':'白魔',
      'order':5
  },
  {
      'job':'占星',
      'order':6
  },
  {
    'job':'贤者',
    'order':7
 }, 
  {
      'job':'学者',
      'order':8
  },
  {
    'job':'战士',
    'order':1
 },
  {
      'job':'枪刃',
      'order':3
  },
  {
      'job':'黑骑',
      'order':2
  },
  {
      'job':'骑士',
      'order':4
  },
  {
      'job':'武士',
      'order':9
  },
  {
      'job':'武僧',
      'order':10
  },
  {
      'job':'镰刀',
      'order':11
  },
  {
    'job':'龙骑',
    'order':13
  },
  {
      'job':'忍者',
      'order':12
  },
  {
    'job':'黑魔',
    'order':14
  },
  {
    'job':'诗人',
    'order':15
  },
  {
    'job':'舞者',
    'order':16
  },
  {
    'job':'机工',
    'order':17
   },
   {
    'job':'召唤',
    'order':18
   },
   {
    'job':'赤魔',
    'order':19
   },
];
//如果不需要改成false
let 打开队伍播放=false;
const sendMessageToParty=(send)=>{
  if (打开队伍播放) {
    callOverlayHandler({ call: 'PostNamazu', c: 'command', p: '/p '+send+' <se.2>' });
  }
 else callOverlayHandler({ call: 'PostNamazu', c: 'command', p: '/e '+send+' <se.2>' });
}
const sendMark=(ActorID,MarkType,是否标记=打开队伍播放)=>{
  if (是否标记)
    callOverlayHandler({ call: 'PostNamazu', c: 'mark', p:'{"ActorID":0x'+ActorID+',"MarkType":'+MarkType+'}'});
 //else  callOverlayHandler({ call: 'PostNamazu', c: 'mark', p:'{"ActorID":0x'+ActorID+',"MarkType":'+MarkType+',LocalOnly:true}'});
}
const clearMark=()=>{
  for (let index = 1; index < 9; index++) {
    callOverlayHandler({ call: 'PostNamazu', c: 'command', p: '/mk clear'+' <'+index+'>' });
    
  }
}
const getMark=(size)=>{
  let waymark1 = {
    B: {
      X: 100+size*Math.cos(0),
      Y: 0,
      Z: 100+size*Math.sin(0),
      Active: true
    }, 
    C: {
      X: 100+size*Math.cos(Math.PI/2),
      Y:0,
      Z: 100+size*Math.sin(Math.PI/2),
      Active: true
    },
    D: {
      X: 100+size*Math.cos(Math.PI),
      Y: 0,
      Z: 100+size*Math.sin(Math.PI),
      Active: true
    },
    A: {
      X: 100+size*Math.cos(3*Math.PI/2),
      Y: 0,
      Z: 100+size*Math.sin(3*Math.PI/2),
      Active: true
    },
};
return JSON.stringify(waymark1);
}
const tankFenZu=['战士','枪刃','黑骑','骑士'];
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
const matchedPositionToDir = (combatant) => {
  // Positions are moved up 100 and right 100
  const y = combatant.PosY - 100;
  const x = combatant.PosX - 100;

  // During Thordan, knight dives start at the 8 cardinals + numerical
  // slop on a radius=23 circle.
  // N = (100, 77), E = (123, 100), S = (100, 123), W = (77, 100)
  // NE = (116.26, 83.74), SE = (116.26, 116.26), SW = (83.74, 116.26), NW = (83.74, 83.74)
  //
  // Starting with northwest to favor sorting between north and south for
  // Advanced Relativity party splits.
  // Map NW = 0, N = 1, ..., W = 7

  return (Math.round(5 - 4 * Math.atan2(x, y) / Math.PI) % 8);
};
const firstMarker = {
  'doorboss': headmarkers.hyperdimensionalSlash,
  'thordan': headmarkers.skywardLeap,
};
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
const EyesPositions=[
  [0,[100,60]],
  [1,[128.28, 71.72]],
  [2,[140.00, 100.00]],
  [3,[128.28, 128.28]],
  [4,[100.00, 140.00]],
  [5,[71.72, 128.28]],
  [6,[60.00, 100.00]],
  [7,[71.72, 71.72]]
];
Options.Triggers.push({
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  timelineFile: 'longshi.txt',
  overrideTimelineFile: true,
  initData: () => {
    return {
      phase: 'doorboss',
      brightwingCounter: 1,
      传毒次数:0,
      firstAdelphelJump: true,
      p7fire:0,
      分摊次数:0,
      背对:false,
    };
  },
  timelineTriggers: [
    {
      id: 'DSR Resentment',
      regex: /Resentment/,
      beforeSeconds: 5,
      condition: (data) => data.phase === 'nidhogg',
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'aoe + dot',
          de: 'AoE + DoT',
          fr: 'AoE + dot',
          ja: 'AoE + DoT',
          cn: 'AOE + dot',
          ko: '전체공격 + 도트뎀',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'DSR Phase Tracker',
      type: 'StartsUsing',
      // 62D4 = Holiest of Holy
      // 63C8 = Ascalon's Mercy Concealed
      // 6708 = Final Chorus
      // 62E2 = Spear of the Fury
      // 6B86 = Incarnation
      // 6667 = unknown_6667
      // 71E4 = Shockwave
      netRegex: NetRegexes.startsUsing({ id: ['62D4', '63C8', '6708', '62E2', '6B86', '6667', '7438'], capture: true }),
      run: (data, matches) => {
        //clearMark();
        switch (matches.id) {
          case '62D4':
            data.phase = 'doorboss';
            break;
          case '63C8':
            //callOverlayHandler({ call: 'PostNamazu', c: 'place', p: 'load'});
            data.phase = 'thordan';
            break;
          case '6708':
            data.phase = 'nidhogg';
            break;
          case '62E2':
            data.phase = 'haurchefant';
            break;
          case '6B86':
            data.phase = 'thordan2';
            break;
          case '6667':
            data.phase = 'nidhogg2';
            break;
          case '71E4':
            data.phase = 'dragon-king';
            break;
        }
      },
    },
    {
      id: '是否打开鲶鱼精播报',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({id: ['62D4', '63C8']}),
      tts:null,
      alertText: (_data, _matches, output) => {
        output.text()},
      outputStrings: {
        text: {
          en:'不要队伍播报就禁用这个',
          cn:'不要队伍播报就禁用这个',
        },
      },
    },
    {
      id: '打开鲶鱼精播报',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({id: ['62D4', '63C8']}),
      disabled: true,
      delaySeconds:2,
      tts:null,
      run: (_data, _matches, output) => {
        打开队伍播放 = true;
        output.text()},

    },
    {
      id: 'DSR Headmarker Tracker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({}),
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => {
        const firstHeadmarker = parseInt(firstMarker[data.phase], 16);
        getHeadmarkerId(data, matches, firstHeadmarker);
      },
    },
    {
      id: 'DSR Holiest of Holy',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D4'}),
      response: Responses.aoe(),
    },
    {
      id: 'DSR Adelphel KB Direction',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D4'}),  
      alertText:(data, matches, output) =>{
          let distance= Math.hypot(matches.x - 100, matches.y - 100);
          if (distance>20)
          {
            data.位置=Math.round(4 - 4 * Math.atan2(matches.x-100, matches.y-100) / Math.PI) % 8;
            switch (data.位置){
              case 0:
                return "面向上边";
                break;
              case 2:
                return "面向右边"
                break;
              case 4:
                return "面向下边"
                break;
              case 6:
                return "面向左边"
                break;
            }
          }
      }
    },
    {
      id: 'DSR Adelphel ID Tracker',
      // 62D2 Is Ser Adelphel's Holy Bladedance, casted once during the encounter
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62D2'}),
      run: (data, matches) => data.adelphelId = matches.sourceId,
    },
    // {
    //   id: 'DSR Adelphel KB Direction',
    //   type: 'NameToggle',
    //   netRegex: NetRegexes.nameToggle({ toggle: '01' }),
    //   condition: (data, matches) => data.phase === 'doorboss' && matches.id === data.adelphelId && data.firstAdelphelJump,
    //   // Delay 0.1s here to prevent any race condition issues with getCombatants
    //   delaySeconds: 0.1,
    //   promise: async (data, matches) => {
    //     data.firstAdelphelJump = false;
    //     // Select Ser Adelphel
    //     let adelphelData = null;
    //     adelphelData = await callOverlayHandler({
    //       call: 'getCombatants',
    //       ids: [parseInt(matches.id, 16)],
    //     });

    //     // if we could not retrieve combatant data, the
    //     // trigger will not work, so just resume promise here
    //     if (adelphelData === null) {
    //       console.error(`Ser Adelphel: null data`);
    //       return;
    //     }
    //     if (!adelphelData.combatants) {
    //       console.error(`Ser Adelphel: null combatants`);
    //       return;
    //     }
    //     const adelphelDataLength = adelphelData.combatants.length;
    //     if (adelphelDataLength !== 1) {
    //       console.error(`Ser Adelphel: expected 1 combatants got ${adelphelDataLength}`);
    //       return;
    //     }

    //     // Add the combatant's position
    //     const adelphel = adelphelData.combatants.pop();
    //     if (!adelphel)
    //       throw new UnreachableCode();
    //     data.adelphelDir = matchedPositionTo4Dir(adelphel);
    //   },
    //   infoText: (data, _matches, output) => {
    //     // Map of directions, reversed to call out KB direction
    //     const dirs= {
    //       0: output.south(),
    //       1: output.west(),
    //       2: output.north(),
    //       3: output.east(),
    //       4: output.unknown(),
    //     };
    //     return output.adelphelLocation({
    //       dir: dirs[data.adelphelDir ?? 4],
    //     });
    //   },
    //   outputStrings: {
    //     north: Outputs.north,
    //     east: Outputs.east,
    //     south: Outputs.south,
    //     west: Outputs.west,
    //     unknown: Outputs.unknown,
    //     adelphelLocation: {
    //       en: 'Go ${dir} (knockback)',
    //       de: 'Geh ${dir} (Rückstoß)',
    //       cn: '面相${dir}',
    //       ko: '${dir} (넉백)',
    //     },
    //   },
    // },
    {
      id: 'DSR Ascalon\'s Mercy Concealed',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C8'}),
      suppressSeconds: 5,
      delaySeconds: (data, matches) => parseFloat(matches.castTime) - 0.7,
      response: Responses.moveAway(),
    },
    {
      id: 'DSR 最后',
      type: 'DSR Broad Swing Right',
      netRegex: NetRegexes.startsUsing({ id: '63C0'}),
      suppressSeconds: 5,
      alertText: (data, _, output) => '后边=>右边',
    },
    {
      id: 'DSR Broad Swing Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C1'}),
      suppressSeconds: 5,
      alertText: (data, _, output) => '后边=>左边',
    },
    {
      id: "DSRp1安全区",
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '62CE'}),
      suppressSeconds: 10,
      duration: 3,
      promise : async (data, matches)=>{
        const me = await callOverlayHandler({
          call: 'getCombatants',
          names: [data.me,matches.source,],
        });
        data.myposX=me.combatants.find((c) => c.Name === data.me).PosX
        data.myposY=me.combatants.find((c) => c.Name === data.me).PosY;
        let p1Boss=me.combatants.find((c) => c.ID === parseInt(matches.sourceId, 16));
        data.heading=p1Boss.Heading;
      },
      alertText: (data, matches, output) => {
        let distance=Math.hypot(matches.x - data.myposX, matches.y- data.myposY);

        data.面向=Math.round(4 - 4 * parseFloat(data.heading) / Math.PI) % 8;
        let left="左左左";
        let right="右右右";
        if (distance<22) {
          switch (data.位置){
            case 0:
              if(data.面向==3) return left
              if(data.面向==5) return right
              break;
            case 2:
              if(data.面向==5) return left
              if(data.面向==7) return right
              break;
            case 4:
              if(data.面向==7) return left
              if(data.面向==1) return right
              break;
            case 6:
              if(data.面向==1) return left
              if(data.面向==3) return right
              break;
          }
        }
        else{
          switch (data.位置){
            case 0:
              if(data.面向==3) return left
              if(data.面向==5) return right
              break;
            case 2:
              if(data.面向==5) return left
              if(data.面向==7) return right
              break;
            case 4:
              if(data.面向==7) return left
              if(data.面向==1) return right
              break;
            case 6:
              if(data.面向==1) return left
              if(data.面向==3) return right
              break;
          }
        }
         
      },
    },
    {
      id: 'DSR Holiest Hallowing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62D0'}),
      alertText: (data, matches, output) => {
        return "打断骑士"
      }
    },
    {
      id: 'DSR Empty Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DA'}),
      condition: (data, matches) => data.phase === 'doorboss' ,
      alertText: (data, _matches, output) => {
        return data.seenEmptyDimension ? output.in() : output.inAndTether();
      },
      run: (data) => data.seenEmptyDimension = true,
      outputStrings: {
        inAndTether: {
          cn: '月环+连线',
        },
        in: Outputs.in,
      },
    },
    {
      id: 'DSR Full Dimension',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DB'}),
      response: Responses.getOut(),
    },
    {
      id: 'DSR Faith Unmoving',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62DC'}),
      response: Responses.knockback(),
    },

    {
      id: 'DSR Hyperdimensional Slash Headmarker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'doorboss' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.hyperdimensionalSlash)
          return output.slashOnYou();
      },
      outputStrings: {
        slashOnYou: {
          cn: '激光点名',
        },
      },
    },
    {
      id: '获取同组',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      tts:null,
      delaySeconds:0.1,
      alertText: (data, matches, output) => {
        if (data.color===undefined) return;
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.firechainSquare&&data.me !== matches.target) {

        }
        switch (data.color){
          case "红":
            if (id === headmarkers.firechainCircle&&data.me !== matches.target) return "同组为"+nametocnjob(matches.target,data);
            break;
          case "绿":
            if (id === headmarkers.firechainTriangle&&data.me !== matches.target) return "同组为"+nametocnjob(matches.target,data);
            break;
          case "紫":
            if (id === headmarkers.firechainSquare&&data.me !== matches.target) return "同组为"+nametocnjob(matches.target,data);
            break;
          case "蓝":
            if (id === headmarkers.firechainX&&data.me !== matches.target) return "同组为"+nametocnjob(matches.target,data);
            break;
          default:
              return;
              break;
        } 
      },
    },
    {
      id: 'DSR Playstation Fire Chains',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: (data, matches) => data.phase === 'doorboss' && data.me === matches.target,
      alertText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        if (id === headmarkers.firechainCircle)
        {
          data.color="红"
          return output.circle();
        }
          
        if (id === headmarkers.firechainTriangle)
        {
          data.color="绿"
          return output.triangle();
        }
          
        if (id === headmarkers.firechainSquare)
        {
          data.color="紫"
          return output.square();
        }
          
        if (id === headmarkers.firechainX)
        {
          data.color="蓝"
          return output.x();
        }
          
      },
      outputStrings: {
        circle: {
          en: 'Red Circle',
          cn: '红',
        },
        triangle: {
          en: 'Green Triangle',
          cn: '绿',  
        },
        square: {
          en: 'Purple Square',
          cn: '紫',
        },
        x: {
          en: 'Blue X',
          cn: '蓝',
        },
      },
    },
    {
      id: '龙诗头部标删除',
      netRegex: NetRegexes.headMarker({}),
      suppressSeconds: 5,
      delaySeconds: 3,
      run: (data) => {
        if(data.bobao) delete data.bobao;
        
      }
  },
    {
      id: 'DSR Skyward Leap',
      netRegex: NetRegexes.headMarker({}),
      durationSeconds: 5,
      tts:null,
      alertText : (data, matches, output)=>{
        const id = getHeadmarkerId(data, matches);
        let num = parseInt(id,16);  
        if (data.bobao === undefined) data.bobao = [];
        if( id=== headmarkers.hyperdimensionalSlash)
        {
          data.bobao.push(nametocnjob(matches.target,data));
          if (data.bobao.length==4)
          {
            let abc= data.bobao.sort((a,b)=>{
              return shunxu.find((c)=>c.job==a).order-shunxu.find((c)=>c.job==b).order
            });

            return abc[0]+abc[1]+abc[2]+abc[3]
          }
        }
        if(id===headmarkers.skywardLeap)
        {
          data.bobao.push(nametocnjob(matches.target,data));
          if (data.bobao.length==3) {
            if (data.ST[3]=='贤者'||data.ST[3]=='占星'||data.ST[3]=='学者'||data.MT[3]=='贤者'||data.MT[3]=='占星'||data.MT[3]=='学者') {
              let changeParty=data.MT.concat(data.ST);
               changeParty.sort((a,b)=>{
                 return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order});
                 data.MT=[changeParty[0],changeParty[2],changeParty[4],changeParty[6]];
                 data.ST=[changeParty[1],changeParty[3],changeParty[5],changeParty[7]];
             }
             let abc= data.bobao.sort((a,b)=>{
              return shunxu.find((c)=>c.job==a).order-shunxu.find((c)=>c.job==b).order
            });
            data.fenzu=data.MT.concat(data.ST);
            let 除坦克外数组=data.fenzu.filter((x)=>!tankFenZu.some((item) => x === item));
            let notDianMing=除坦克外数组.filter((x)=>!abc.some((item) => x === item));  
            if (data.role==="tank") return '接线';
            if (data.bobao.includes(nametocnjob(data.me,data))) {
              return "蓝标点名"+abc[0]+abc[1]+abc[2];
            }
            else{
              return  '无点名'+notDianMing[2]+notDianMing[1]+notDianMing[0];
            }
          }
        }
        // else
        // {
        //   return parseInt(id,16)
        // }
        
      }
  },
  {
    id: '测试',
    type: 'GameLog',
    netRegex: NetRegexes.gameNameLog({ line: '测试' }),
    promise : async (data)=>{
      const bossData = await callOverlayHandler({
        call: 'getCombatants',
      });
      //let WhiteDragon = bossData.combatants.filter((boss) => boss.BNpcID===12612&&boss.BNpcNameID===3458);
      //let 地火 = bossData.combatants.filter((boss) => boss.BNpcID===0x233c);
      let 地火 = bossData.combatants.filter((boss) => boss.ID===0x40005E38);
      console.log(地火);
     
    },
  },
  // {
  //   id: '面相123',
  //   netRegex: NetRegexes.gameNameLog({ line: '龙眼(?<index>.+?)' }),
  //   tts:null,
  //   durationSeconds:3,
  //   sound: '',
  //   soundVolume: 0,
  //   promise : async (data, matches)=>{
  //     const boss = await callOverlayHandler({
  //       call: 'getCombatants',
  //     });
  //      data.my = boss.combatants.find((c) => c.Name === data.me);

  //      let bossData2= boss.combatants.filter((boss) => boss.BNpcNameID===3632&&boss.BNpcID==12611);
  //      if (bossData2.length>0)  bossData2=bossData2;
  //      else bossData2=boss.combatants.filter((boss) => boss.BNpcNameID===3632&&boss.BNpcID==12604);
  //      let bossData123=boss.combatants.filter((boss) => boss.BNpcNameID===3632&&boss.BNpcID==12604)[0];
  //      if (data.phase=='thordan') {
  //        bossData123=boss.combatants.filter((boss) => boss.BNpcNameID===3632&&boss.BNpcID==12604)[0]
  //      }
  //      if (data.phase=='thordan2') {
  //        bossData123=boss.combatants.filter((boss) => boss.BNpcNameID===3632&&boss.BNpcID==12611)[0]
  //      }
  //      data.骑神=bossData123;
  //     return ;
  //   },  
  //   alertText:(data, matches, output)=>{
  //     let vector2X=data.骑神.PosX-data.my.PosX;let vector2Y=data.骑神.PosY-data.my.PosY;
  //     let vector1X=0;let vector1Y=1;
  //     let RelativeAngle=(((Math.atan2(vector2Y,vector2X)-Math.atan2(vector1Y,vector1X))*(180/Math.PI)+360+180)%360+(data.my.Heading*(180/Math.PI)+360)%360)%360;
  //     let 面相骑神=RelativeAngle>180 - 46&&RelativeAngle<180 + 46 ;
  //     let 龙眼位置=EyesPositions[+matches.index][1];
  //     let vector3X=龙眼位置[0]-data.my.PosX;let vector3Y=龙眼位置[1]-data.my.PosY;
  //     let RelativeAngle1=(((Math.atan2(vector3Y,vector3X)-Math.atan2(vector1Y,vector1X))*(180/Math.PI)+360+180)%360+(data.my.Heading*(180/Math.PI)+360)%360)%360;
  //     let 面相眼睛=RelativeAngle1>180 - 46&&RelativeAngle1<180 + 46 ;
  //     console.log(data.骑神);
  //     console.log(RelativeAngle+'+'+RelativeAngle1);
  //     let 面相正确=面相骑神&&面相眼睛;
  //     let 面相=面相正确? '错误':'正确';
  //     return '面相'+面相;
     
  //   },
  // },
  {
    id: 'DSR Spiral Thrust Safe Spots',
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: '63D3'}),
    delaySeconds: 4.5,
    promise : async (data)=>{
      const bossData = await callOverlayHandler({
        call: 'getCombatants',
      });
       data.boss1 = bossData.combatants.filter((boss) => boss.BNpcNameID===3636)[0];
       data.boss2 = bossData.combatants.filter((boss) => boss.BNpcNameID===3637)[0];
       data.boss3 = bossData.combatants.filter((boss) => boss.BNpcNameID===3638)[0];
      //  data.红色骑士=bossData.combatants.filter((boss) => boss.BNpcID===0x3139)[0];
      //  data.大剑骑士=bossData.combatants.filter((boss) => boss.BNpcID===0x3130)[0];
      return ;
    },
    alertText: (data, matches, output) => {
      if (data.一运位置 === undefined) data.一运位置 = [];
      const dirNums1 = [0, 1, 2, 3, 4, 5, 6, 7];
      data.一运位置.push(Math.round(4 - 4 * Math.atan2(data.boss1.PosX-100, data.boss1.PosY-100) / Math.PI) % 8);
      data.一运位置.push(Math.round(4 - 4 * Math.atan2(data.boss2.PosX-100, data.boss2.PosY-100) / Math.PI) % 8);
      data.一运位置.push(Math.round(4 - 4 * Math.atan2(data.boss3.PosX-100, data.boss3.PosY-100) / Math.PI) % 8);
      if (data.一运位置[0] ||data.一运位置[0] === 0) {
          delete dirNums1[( data.一运位置[0] + 4) % 8];
          delete dirNums1[ data.一运位置[0]];
        }
        if (data.一运位置[1]  ||data.一运位置[1] === 0) {
          delete dirNums1[( data.一运位置[1] + 4) % 8];
          delete dirNums1[ data.一运位置[1]];
        }
        if (data.一运位置[2]  ||data.一运位置[2] === 0) {
          delete dirNums1[( data.一运位置[2] + 4) % 8];
          delete dirNums1[ data.一运位置[2]];
        }
        if (data.partJob === undefined) data.partJob = [];
        for (let i = 0; i < 8; i++) {
          let job=nametocnjob(data.party.idToName_[data.party.partyIds_[i]],data);
           data.partJob[i]={'ID':data.party.partyIds_[i],'job': job};
        }
        if (dirNums1.includes(0)) {sendMessageToParty("AC安全");return "AC安全";}
        if (dirNums1.includes(1)) {sendMessageToParty("13安全");return "13安全";}
        if (dirNums1.includes(2)) {sendMessageToParty("BD安全");return "BD安全";}
        if (dirNums1.includes(3)) {sendMessageToParty("24安全");return "24安全";}
    }
  },
  
  {
    id: 'DSR Ancient Quaga',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '63C6'}),
    response: Responses.aoe(),
  },
  {
    id: 'DSR Sanctity of the Ward Swords',
    type: 'HeadMarker',
    netRegex: NetRegexes.headMarker(),
    condition: (data, matches) => data.phase === 'thordan',
    alertText: (data, matches, output) => {
      const id = getHeadmarkerId(data, matches);
      if(id!=headmarkers.sword1&&id!=headmarkers.sword2) return;
      if (data.bobao === undefined) data.bobao = [];
      if (id === headmarkers.sword1)
        data.bobao.push(nametocnjob(matches.target,data));
      if (id === headmarkers.sword2)
      data.bobao.push(nametocnjob(matches.target,data));
      if(data.bobao.length>=2){
        data.myJob=nametocnjob(data.me,data);
        let firstInMt=data.MT.includes(data.bobao[0])?'MT组':'';
        let firstInST=data.ST.includes(data.bobao[0])?'ST组':'';
        let secondInMt=data.MT.includes(data.bobao[1])?'MT组':'';
        let secondInST=data.ST.includes(data.bobao[1])?'ST组':'';
      sendMessageToParty(firstInMt+firstInST+'1号点名'+data.bobao[0]+secondInMt+secondInST +'2号点名'+data.bobao[1]);
      return
      return firstInMt+firstInST+'1号点名'+data.bobao[0]+secondInMt+secondInST +'2号点名'+data.bobao[1]};
    },
  },

  {
    id: 'DSR Sanctity of the Ward Meteor Role',
    type: 'HeadMarker',
    netRegex: NetRegexes.headMarker(),
    tts:null,
    condition: (data, matches) => data.phase === 'thordan',
    alertText: (data, matches, output) => {
      const id = getHeadmarkerId(data, matches);
      if (id === headmarkers.meteor)
        {
          if (data.bobao === undefined)  data.bobao  = [];
          data.bobao.push(nametocnjob(matches.target,data))
          if (data.bobao.length>=2) 
          
          {  let a='陨石点名'+data.bobao[0]+data.bobao [1];
          data.redIsMy=data.bobao.includes(nametocnjob(data.me,data));
          data.other=data.bobao.find((i)=>i!==nametocnjob(data.me,data));
          sendMessageToParty(a);
            return a}
        }
    },
  },

  {
    id: 'DSR 获取分组',
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: '63CD'}),
    condition: (data, matches) => data.phase === 'thordan',
    run: (data, matches) => {
      let 方位=Math.round(4 - 4 * Math.atan2(matches.targetX-100, matches.targetY-100) / Math.PI) % 8;
      if (data.ST === undefined) data.ST = [];
      if (data.MT === undefined) data.MT = [];
      if (data.fenzu === undefined) data.fenzu = [];
      if (方位===6||方位===7||方位===0||方位===1) {
        data.MT.push(nametocnjob(matches.target,data))
        if (data.MT.length>=4)  {
          data.MT.sort((a,b)=>{
            return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order});
      }
      }
      else{
        data.ST.push(nametocnjob(matches.target,data))
        data.ST.sort((a,b)=>{
          return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order});
      }

    },
  },

  //固定ac打发
  // {
  //   id: 'DSR Sanctity of the Ward Meteor You',
  //   type: 'HeadMarker',
  //   netRegex: NetRegexes.headMarker(),
  //   condition: (data, matches) => data.phase === 'thordan',
  //   durationSeconds:5,
  //   alertText: (data, matches, output) => {
  //     const id = getHeadmarkerId(data, matches);
  //     if (id === headmarkers.meteor)
  //       {
  //         if(data.bobao.length>=2 )
  //         {
  //           console.log(data.fenzu);
  //           let aPart=[data.fenzu[0],data.fenzu[2]];
  //           let bPart=[data.fenzu[5],data.fenzu[7]];
  //           let cPart=[data.fenzu[4],data.fenzu[6]];
  //           let dPart=[data.fenzu[1],data.fenzu[3]];
  //           let dianMingA=aPart.includes(data.bobao[0])||aPart.includes(data.bobao[1]);
  //           let dianMingB=bPart.includes(data.bobao[0])||bPart.includes(data.bobao[1]);
  //           let dianMingC=cPart.includes(data.bobao[0])||cPart.includes(data.bobao[1]);
  //           let dianMingD=dPart.includes(data.bobao[0])||dPart.includes(data.bobao[1]);
  //           let bobao="";;
  //           if (dianMingA&&dianMingB) bobao='BC互换';
  //           if (dianMingA&&dianMingC) bobao='原地放陨石';
  //           if (dianMingA&&dianMingD) bobao='CD互换';
  //           if (dianMingB&&dianMingC) bobao='AB互换';
  //           if (dianMingB&&dianMingD) bobao='BC AD互换';
  //           if (dianMingC&&dianMingD) bobao='AD互换';
  //           sendMessageToParty(bobao);
  //           return bobao
  //         }
  //       }
  //   },
  // },
  //文档打发
  {
    id: 'DSR Sanctity of the Ward Meteor You',
    type: 'HeadMarker',
    netRegex: NetRegexes.headMarker(),
    condition: (data, matches) => data.phase === 'thordan',
    alertText: (data, matches, output) => {
      const id = getHeadmarkerId(data, matches);
      if (id === headmarkers.meteor)
        {
          if(data.bobao.length>=2 )
          {
            data.myJob=nametocnjob(data.me,data);
            data.fenzu=data.MT.concat(data.ST);
            let a=data.fenzu.indexOf(data.bobao[0]);
            let b=data.fenzu.indexOf(data.bobao[1]);
            let c=data.bobao.indexOf(data.myJob);
            if (a>b) 
            {
              let d=a;
              a=b;
              b=d;
            }
            data.bobao.sort((a,b)=>{
              return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order
            });
            //return a+':'+b
            // console.log(data.fenzu);
            // console.log(a+':'+b);
            if (a+4===b&&a==0) return '不用换位';
            //点名TN
            if ((a==0||a===1)&&(b==1||b==4||b==5)) {
              if (data.role=== 'tank'&&c>=0) return '和无点名N换位'
              if (data.role=== 'healer'&&c===-1) return '和点名T换位'
              return '不用换位';
            }
            //点名DPS
            else{
              if (data.bobao[0]==c) return '和无点名远程换位'
              return '不用换位';
            }
          }
        }
    },
  },
  //记录位置
  {
    id: 'DSR p3第一次塔位置',
    type: 'Ability',
    netRegex: NetRegexes.ability({ id:'737C'}),
    run :(data, matches) => {
      if (nametocnjob(matches?.target,data)==data.other) {
        data.otherPos=2- 2 * Math.atan2(matches.x-100, matches.y-100) / Math.PI % 4;
      }
      if (data.me === matches?.target&&data.redIsMy) {
        data.myPos=2- 2 * Math.atan2(matches.x-100, matches.y-100) / Math.PI % 4;
        data.myOpposite=Math.round(2 - 2 * Math.atan2(matches.targetX-100, matches.targetY-100) / Math.PI+2) % 4;
        if (data.myOpposite<data.myPos) {
          data.myOpposite=+4;
        }
        
      }
    },
  },
  {
    id: 'DSR p3标记',
    type: 'Ability',
    netRegex: NetRegexes.ability({ id:'737C'}),
    delaySeconds:0.5,
    run :(data, matches) => {
      if (data.me === matches?.target&&data.redIsMy) {
        if (data.otherPos<data.myPos) {
          data.otherPos=+4;
        }
        if (data.otherPos>data.myOpposite) data.otherPos=data.myOpposite
        //塔距中间18
        let 角度=Math.PI*(data.otherPos-data.myPos)/2;
        let 划分=角度/7;
        data.myPos=data.myPos-1;
        let pos1y=data.myPos*Math.PI/2;
        let pos1x=data.myPos*Math.PI+划分;
        var waymark = {
          A: {
            X: 100+18*Math.cos(data.myPos*Math.PI/2+划分),
            Y: matches.z,
            Z: 100+18*Math.sin(data.myPos*Math.PI/2+划分),
            Active: true
          }, 
          B: {
            X: 100+18*Math.cos(data.myPos*Math.PI/2+划分*2),
            Y: matches.z,
            Z: 100+18*Math.sin(data.myPos*Math.PI/2+划分*2),
            Active: true
          },
          C: {
            X: 100+18*Math.cos(data.myPos*Math.PI/2+划分*3),
            Y: matches.z,
            Z: 100+18*Math.sin(data.myPos*Math.PI/2+划分*3),
            Active: true
          },
          D: {
            X: 100+18*Math.cos(data.myPos*Math.PI/2+划分*4),
            Y: matches.z,
            Z: 100+18*Math.sin(data.myPos*Math.PI/2+划分*4),
            Active: true
          },
          One: {
            X: 100+18*Math.cos(data.myPos*Math.PI/2+划分*5),
            Y: matches.z,
            Z: 100+18*Math.sin(data.myPos*Math.PI/2+划分*5),
            Active: true
          },
          Two: {
            X: 100+18*Math.cos(data.myPos*Math.PI/2+划分*6),
            Y: matches.z,
            Z: 100+18*Math.sin(data.myPos*Math.PI/2+划分*6),
            Active: true
          },
          Three: {
            X: 100+18*Math.cos(data.myPos*Math.PI/2+划分*7),
            Y: matches.z,
            Z: 100+18*Math.sin(data.myPos*Math.PI/2+划分*7),
            Active: true
          },

      };
      //callOverlayHandler({ call: 'PostNamazu', c: 'place', p: 'save'});
      //callOverlayHandler({ call: 'PostNamazu', c: 'place', p: JSON.stringify(waymark)});

      }
    },
  },
  {
    id: 'DSR p3恢复',
    type: 'Ability',
    netRegex: NetRegexes.ability({ id:'737C'}),
    delaySeconds:20,
    run :(data, matches) => {
      if (data.me === matches?.target&&data.redIsMy) {

      //callOverlayHandler({ call: 'PostNamazu', c: 'place', p: 'load'});

      }
    },
  },
  //二运顺逆
  {
    id: 'DSR Sanctity of the Ward Direction',
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: '63E1'}),
    duration:10,
    condition: (data) => data.phase === 'thordan',
    delaySeconds: 4.3,
    promise: async (data) => {
      // Only need to know one of the knights locations, Ser Janlenoux (3635)
      let combatantDataJanlenoux1 = null;
      let combatantDataJanlenoux = null;

        combatantDataJanlenoux1  = await callOverlayHandler({
          call: 'getCombatants',
        });

      combatantDataJanlenoux=combatantDataJanlenoux1.combatants.filter((boss) => boss.BNpcNameID===3635);
      // if we could not retrieve combatant data, the
      // trigger will not work, so just resume promise here

      // Sort to retreive last combatant in list
      const sortCombatants = (a ,b) => (a.ID ?? 0) - (b.ID ?? 0);
      const combatantJanlenoux =combatantDataJanlenoux.sort(sortCombatants).shift();
      if (!combatantJanlenoux)
        throw new UnreachableCode();
      data.sanctityWardDir = matchedPositionToDir(combatantJanlenoux);
    },
    infoText: (data, _matches, output) => {
      // Map of directions
      const dirs= {
        0: output.counterclock(),
        1: output.unknown(), // north position
        2: output.clockwise(),
        3: output.clockwise(),
        4: output.clockwise(),
        5: output.unknown(), // south position
        6: output.counterclock(),
        7: output.counterclock(),
        8: output.unknown(),
      };
      sendMessageToParty(dirs[data.sanctityWardDir ?? 8]);
      return dirs[data.sanctityWardDir ?? 8];
    },
    run: (data) => delete data.sanctityWardDir,
    outputStrings: {
      clockwise: {
        en: 'Clockwise',
        cn: '逆时针(左)'
      },
      counterclock: {
        en: 'Counterclockwise',
        cn: '顺时针(右)',
      },
      unknown: Outputs.unknown,
    },
  },
  {
    id: 'DSR Dragon\'s Rage',
    // 63C4 Is Thordan's --middle-- action, thordan jumps again and becomes untargetable, shortly after the 2nd 6C34 action
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: '63C4', source: 'King Thordan' }),
    netRegexDe: NetRegexes.ability({ id: '63C4', source: 'Thordan' }),
    netRegexFr: NetRegexes.ability({ id: '63C4', source: 'Roi Thordan' }),
    netRegexJa: NetRegexes.ability({ id: '63C4', source: '騎神トールダン' }),
    netRegexCn: NetRegexes.ability({ id: '63C4', source: '骑神托尔丹' }),
    netRegexKo: NetRegexes.ability({ id: '63C4', source: '기사신 토르당' }),
    condition: (data) => (data.phase === 'thordan' && (data.thordanJumpCounter = (data.thordanJumpCounter ?? 0) + 1) === 2),
    delaySeconds: 0.7,
    promise: async (data, matches) => {
      // Select King Thordan
      let thordanData = null;
      thordanData = await callOverlayHandler({
        call: 'getCombatants',
        ids: [parseInt(matches.sourceId, 16)],
      });
      // if we could not retrieve combatant data, the
      // trigger will not work, so just resume promise here
      if (thordanData === null) {
        console.error(`King Thordan: null data`);
        return;
      }
      if (!thordanData.combatants) {
        console.error(`King Thordan: null combatants`);
        return;
      }
      const thordanDataLength = thordanData.combatants.length;
      if (thordanDataLength !== 1) {
        console.error(`King Thordan: expected 1 combatants got ${thordanDataLength}`);
        return;
      }

      // Add the combatant's position
      const thordan = thordanData.combatants.pop();
      if (!thordan)
        throw new UnreachableCode();
      data.thordanDir = matchedPositionToDir(thordan);
    },
    infoText: (data, _matches, output) => {
      // Map of directions
      const dirs = {
        0: output.northwest(),
        1: output.north(),
        2: output.northeast(),
        3: output.east(),
        4: output.southeast(),
        5: output.south(),
        6: output.southwest(),
        7: output.west(),
        8: output.unknown(),
      };
      return output.thordanLocation({
        dir: dirs[data.thordanDir ?? 8],
      });
    },
    run: (data) => delete data.thordanDir,
    outputStrings: {
      north: '上',
      northeast: '右上↗',
      east: '右',
      southeast: '右下↘',
      south: '下',
      southwest: '↙左下',
      west: '左',
      northwest: '↖左上',
      unknown: Outputs.unknown,
      thordanLocation: {
        en: 'Boss: ${dir}',
        cn:'骑神在: ${dir}'
      },
    },
  },
  {
    id: 'DSR Dive From Grace Number',
    type: 'HeadMarker',
    netRegex: NetRegexes.headMarker(),
    condition: (data, matches) => data.phase === 'thordan',
    alertText: (data, matches, output) => {
      const id = getHeadmarkerId(data, matches);
      if (id === headmarkers.majiang1)
      {
        if (data.majiang1 === undefined) data.majiang1 = [];
        data.majiang1.push(nametocnjob(matches.target,data));
        if (data.majiang1.length>=3)  {
          data.majiang1.sort((a,b)=>{
            return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order});
           sendMessageToParty('麻将1'+data.majiang1[0]+data.majiang1[1]+data.majiang1[2]);
        }
      }
      if (id === headmarkers.majiang2) {
        if (data.majiang2 === undefined) data.majiang2 = [];
        data.majiang2.push(nametocnjob(matches.target,data));
       if (data.majiang2.length>=2)  {
        data.majiang2.sort((a,b)=>{
          return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order});
          sendMessageToParty('麻将2'+data.majiang2[0]+data.majiang2[1]);
       }
      }
      if (id === headmarkers.majiang3) {
        if (data.majiang3 === undefined) data.majiang3 = [];
        data.majiang3.push(nametocnjob(matches.target,data));
       if (data.majiang3.length>=3)   {
        data.majiang3.sort((a,b)=>{
          return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order});
          sendMessageToParty('麻将3'+data.majiang3[0]+data.majiang3[1]+data.majiang3[2]);}
      }
     
      if (matches.target===data.me) {
      if (id === headmarkers.majiang1) {data.majiang=1; return '麻将1'};
      if (id === headmarkers.majiang2) {data.majiang=2;return '麻将2';}
      if (id === headmarkers.majiang3) {data.majiang=3;return '麻将3';}
      }
    },
  },
  {
    id: 'DSR Eyes Dive Counter',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'], capture: true }),
    condition: Conditions.targetIsYou(),
    delaySeconds: (data, matches) => parseFloat(matches.duration) - 5,
    infoText: (data, matches, output) => {
      if (matches.effectId === 'AC3') return '原地放塔'
      if (matches.effectId === 'AC4') return '向前放塔'
      if (matches.effectId === 'AC5') return '背对放塔'
      }
  },
  {
    id: 'DSR Dive From Grace Post Stack',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'], capture: true }),
    tts:null,
    durationSeconds: 20,
    infoText: (data, matches, output) => {
      let job=nametocnjob(matches.target,data);
      if (data.yuan=== undefined) data.yuan = [];
      if (data.shang=== undefined) data.shang = [];
      if (data.xia=== undefined) data.xia = [];
      if (data.buff=== undefined) data.buff = [];
      let majiang=null;
      if (data.majiang1.includes(job))  majiang=1;
      if (data.majiang2.includes(job))  majiang=2;
      if (data.majiang3.includes(job))  majiang=3;

      //圆圈点名
      if (matches.effectId === 'AC3') {
        data.yuan.push(job);
        data.buff.push({'majiang':majiang,'buff':'圆','job':job})
      };
      //上箭头 
      if (matches.effectId === 'AC4') {
        data.buff.push({'majiang':majiang,'buff':'上','job':job})
        if (matches.target==data.me) {
        }
        data.shang.push(job);
      };
      //下箭头 
      if (matches.effectId === 'AC5') {
        data.buff.push({'majiang':majiang,'buff':'下','job':job})
        if (matches.target==data.me) {

        }
        data.xia.push(job);
      };
      if (data.buff.length>=8) data.my=data.buff.find((a)=>a.job===data.myJob)
      if (matches.target!==data.me) return;
      if (data.yuan.includes(data.myJob)) {
        return '原地防塔'
        
      }
      if (data.shang.includes(data.myJob)) {
        return '正对放塔'
        
      }
      if (data.xia.includes(data.myJob)) {
        return '背对放塔'
      }
    },

  },
  {
    id: 'DSR Gnash and Lash',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '6712'}),
    delaySeconds:4,
    durationSeconds:15,
    response: Responses.getOutThenIn(),
  },
  {
    id: 'DSR Lash and Gnash',
    type: 'StartsUsing',
    delaySeconds:4,
    netRegex: NetRegexes.startsUsing({ id: '6713'}),
    durationSeconds:15,
    response: Responses.getInThenOut(),
  },
  {
    id: 'DSR Lash Gnash Followup',
    type: 'Ability',
    // 6715 = Gnashing Wheel
    // 6716 = Lashing Wheel
    netRegex: NetRegexes.ability({ id: ['6715', '6716']}),
    // These are ~3s apart.  Only call after the first (and ignore multiple people getting hit).
    suppressSeconds: 6,
    infoText: (_data, matches, output) => matches.id === '6715' ? output.in() : output.out(),
    outputStrings: {
      out: Outputs.out,
      in: Outputs.in,
    },
  },

  //0:11
  {
    id: 'DSR Dive From Grace Dir You',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'], capture: true }),
    delaySeconds:0.5,
    duration:7,
    condition: Conditions.targetIsYou(),
    alertText: (data, matches, output) => {
      if (data.buff.length>=8) 
      {data.mybuff=data.buff.find((i)=>i.job===data.myJob);
      data.majiang11=data.buff.filter((i)=>i.majiang===1);
      data.majiang22=data.buff.filter((i)=>i.majiang===2);
      data.majiang33=data.buff.filter((i)=>i.majiang===3);
      //让麻将用shunxu2排序
      data.majiang11.sort((a,b)=>{
        return shunxu2.find((c)=>c.job==a.job).order-shunxu2.find((c)=>c.job==b.job).order});
      data.majiang22.sort((a,b)=>{
        return shunxu2.find((c)=>c.job==a.job).order-shunxu2.find((c)=>c.job==b.job).order});
      data.majiang33.sort((a,b)=>{
        return shunxu2.find((c)=>c.job==a.job).order-shunxu2.find((c)=>c.job==b.job).order});
        //更换位置
       if (data.majiang11.find((i)=>i.buff=="上")) {
          data.majiang1[0]=data.majiang11.find((i)=>i.buff=='上');
          data.majiang1[1]=data.majiang11.find((i)=>i.buff=='圆');
          data.majiang1[2]=data.majiang11.find((i)=>i.buff=='下');

        }
        else  data.majiang1=data.majiang11;
        if (data.majiang22.find((i)=>i.buff=="上")) {
          data.majiang2[0]=data.majiang22.find((i)=>i.buff=='下');
          data.majiang2[1]=data.majiang22.find((i)=>i.buff=='上');

        }
        else  data.majiang2=data.majiang22;
        if (data.majiang33.find((i)=>i.buff=="上")) {
          data.majiang3[0]=data.majiang33.find((i)=>i.buff=='上');
          data.majiang3[1]=data.majiang33.find((i)=>i.buff=='圆');
          data.majiang3[2]=data.majiang33.find((i)=>i.buff=='下');
        }
        else  data.majiang3=data.majiang33;
      let 标记1=data.majiang1.map((i)=>data.partJob.find((j)=>j.job==i.job));
      let 标记2=data.majiang2.map((i)=>data.partJob.find((j)=>j.job==i.job));
      let 标记3=data.majiang3.map((i)=>data.partJob.find((j)=>j.job==i.job));
      //sendMark(标记1[0].ID,1,true);sendMark(标记1[1].ID,2,true);sendMark(标记1[2].ID,3,true);
      //sendMark(标记3[0].ID,6,true);sendMark(标记3[1].ID,7,true);sendMark(标记3[2].ID,8,true);
      //sendMark(标记2[0].ID,9,true);sendMark(标记2[1].ID,10,true);
      if (data.mybuff.majiang==1&&data.mybuff.buff=='上') return '站D点面对boss';
      if (data.mybuff.majiang==1&&data.mybuff.buff=='下') return '站B点背对boss';
      if (data.mybuff.majiang==1&&(data.majiang1[0].buff!==data.majiang1[1].buff))  return '站在C';
      if (data.mybuff.majiang==1&&data.mybuff.buff=='圆'){
        switch(data.majiang1.findIndex((i)=>i.job==data.myJob)){
          case 0:
          return '站在B';
          case 1:
          return '站在C'
          case 2:
          return '站在D'
        }
      }
      else return 'A方向集合分摊'
      }
    }

  },
  //0:20
  {
    id: 'DSR Dive From Grace Tower 2 and Stacks',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'], capture: true }),
    delaySeconds:8,
    condition: Conditions.targetIsYou(),
    alertText: (data, matches, output) => {
      if (data.majiang2[0].buff==data.majiang2[1].buff&&data.mybuff.majiang==2) {
        if (data.majiang2.findIndex((i)=>i.job==data.myJob)===0) return '准备去右上放塔'
        if (data.majiang2.findIndex((i)=>i.job==data.myJob)===1) return '准备去左上放塔'
      }
      if (data.majiang2[0].buff!=data.majiang2[1].buff&&data.mybuff.majiang==2) {
        if (data.mybuff.buff=='上') return '准备去左上放塔'
        if (data.mybuff.buff=='下') return '准备去右上放塔'
      }
      if (data.mybuff.majiang==1) return '去A附近准备踩塔' 
      if (data.mybuff.majiang==3&&data.mybuff.buff=='上') return '去D点踩塔';
      if (data.mybuff.majiang==3&&data.mybuff.buff=='下') return '去B点踩塔';
      if (data.mybuff.majiang==3&&(data.majiang3[0].buff!==data.majiang3[1].buff))  return '去C点踩塔';
      if (data.mybuff.majiang==3&&data.mybuff.buff=='圆'){
        switch(data.majiang3.findIndex((i)=>i.job==data.myJob)){
          case 0:
          return '去B点踩塔';
          case 1:
          return '去C点踩塔'
          case 2:
          return '去D点踩塔'
        }
      }
    }

  },
  //0:26
  {
    id: 'DSR Dive From Grace Dive Position',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'], capture: true }),
    delaySeconds:17,
    condition: Conditions.targetIsYou(),
    alertText: (data, matches, output) => {

      if (data.mybuff.majiang3==2) return '引导武神枪朝外然后去A分摊';
      if (data.majiang2[0].buff==data.majiang2[1].buff&&data.mybuff.majiang==2) {
        if (data.majiang2.findIndex((i)=>i.job==data.myJob)===0) return '去右上放塔'
        if (data.majiang2.findIndex((i)=>i.job==data.myJob)===1) return '去左上放塔'
      }
      if (data.majiang2[0].buff!=data.majiang2[1].buff&&data.mybuff.majiang==2) {
        if (data.mybuff.buff=='上') return '去左上放塔'
        if (data.mybuff.buff=='下') return '去右上放塔'
      }
    }

  },
   //0:30
  {
    id: 'DSR Dive From Grace Tower 1',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'], capture: true }),
    delaySeconds:18,
    condition: Conditions.targetIsYou(),
    alertText: (data, matches, output) => {
      if (data.mybuff.majiang==1&&data.mybuff.buff=='上') return '踩左上塔';
      if (data.mybuff.majiang==1&&data.mybuff.buff=='下') return '踩右上塔';
      if (data.mybuff.majiang==1&&(data.majiang1[0].buff!==data.majiang1[1].buff)||data.mybuff.majiang==2)  return '去A点分摊';
      if (data.mybuff.majiang==1&&data.mybuff.buff=='圆'){
        switch(data.majiang1.findIndex((i)=>i.job==data.myJob)){
          case 0:
          return '踩右上塔';
          case 1:
          return '去A点分摊';
          case 2:
          return '踩左上塔';
        }
      }
    }

  },
  //0:38
  {
    id: 'DSR Darkdragon Dive Single Tower',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'], capture: true }),
    delaySeconds:25,
    condition: Conditions.targetIsYou(),
    alertText: (data, matches, output) => {
      if (data.mybuff.majiang==1&&data.mybuff.buff=='上') return '引导武神枪朝外然后去A分摊';
      if (data.mybuff.majiang==1&&data.mybuff.buff=='下') return '引导武神枪朝外然后去A分摊';
      if (data.mybuff.majiang==1&&(data.majiang1[0].buff!==data.majiang1[1].buff))  return ;
      if (data.mybuff.majiang==1&&data.mybuff.buff=='圆'){
        switch(data.majiang1.findIndex((i)=>i.job==data.myJob)){
          case 0:
          return '引导武神枪朝外然后去A分摊';
          case 2:
          return '引导武神枪朝外然后去A分摊';
        }
      }
    }

  },
  //0:30
  {
    id: 'DSR Dive From Grace Tower 3',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'], capture: true }),
    delaySeconds:19,
    condition: Conditions.targetIsYou(),
    alertText: (data, matches, output) => {
      if (data.mybuff.majiang==3&&data.mybuff.buff=='上') return '去D点放塔';
      if (data.mybuff.majiang==3&&data.mybuff.buff=='下') return '去B点放塔';
      if (data.mybuff.majiang==3&&(data.majiang3[0].buff!==data.majiang3[1].buff))  return '去C点放塔';
      if (data.mybuff.majiang==3&&data.mybuff.buff=='圆'){
        switch(data.majiang3.findIndex((i)=>i.job==data.myJob)){
          case 0:
          return '去B点放塔';
          case 1:
          return '去C点放塔'
          case 2:
          return '去D点放塔'
        }
    }
  }

  },
  //0:40
  {
    id: 'DSR Dive From Grace Post Dive',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'], capture: true }),
    delaySeconds:29,
    condition: Conditions.targetIsYou(),
    alertText: (data, matches, output) => {
      if (data.majiang2[0].buff==data.majiang2[1].buff&&data.mybuff.majiang==2) {
        if (data.majiang2.findIndex((i)=>i.job==data.myJob)===0) return '去B踩塔'
        if (data.majiang2.findIndex((i)=>i.job==data.myJob)===1) return '去D踩塔'
      }
      if (data.mybuff.majiang==1&&(data.majiang1[0].buff!==data.majiang1[1].buff)&&data.mybuff.buff=='圆')  return '去C点踩塔';
      if (data.majiang1.findIndex((i)=>i.job==data.myJob)==1) return '去C点踩塔';
      if (data.majiang2[0].buff!=data.majiang2[1].buff&&data.mybuff.majiang==2) {
        if (data.mybuff.buff=='上') return '去BD踩塔'
        if (data.mybuff.buff=='下') return '去B踩塔'
      }
    }

  },
  //0:45
  {
    id: '【武神枪三】引导',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['AC3', 'AC4', 'AC5'], capture: true }),
    delaySeconds:34,
    condition: Conditions.targetIsYou(),
    alertText: (data, matches, output) => {
      if (data.majiang2[0].buff==data.majiang2[1].buff&&data.mybuff.majiang==2) {
        if (data.majiang2.findIndex((i)=>i.job==data.myJob)===0) return '引导武神枪朝外'
        if (data.majiang2.findIndex((i)=>i.job==data.myJob)===1) return '引导武神枪朝外'
      }
      if (data.majiang1.findIndex((i)=>i.job==data.myJob)==1) return '引导武神枪朝外';
      if (data.majiang2[0].buff!=data.majiang2[1].buff&&data.mybuff.majiang==2) {
        if (data.mybuff.buff=='上') return '引导武神枪朝外'
        if (data.mybuff.buff=='下') return '引导武神枪朝外'
      }
    }

  },
  {
    id: 'DSR 引导枪',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '670A'}),
    promise : async (data)=>{
      const me = await callOverlayHandler({
        call: 'getCombatants',
        names: [data.me],
      });
      data.myposX=me.combatants[0]?.PosX
      data.myposY=me.combatants[0]?.PosY;
    },
    alertText:(data, matches, output) => {
      let abc=Math.hypot(matches.x - data.myposX, matches.y- data.myposY);
      if ( Math.hypot(matches.x - data.myposX, matches.y- data.myposY)<4) {
        return '走走走'
      }
    }
  },
  {
    id: 'DSR 顺劈',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '670B'}),

    alertText:(data, matches, output) => {
      {
        //clearMark();
        return '离开正面'
      }
    }
  },
  {
    id: 'DSR 收集塔位置',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id:  ['6717', '6718', '6719', '671A']}),  
    alertText:(data, matches, output) =>{
      //右上1 右下2 左下3 左上
      let weizhi=Math.round(2- 2 * Math.atan2(matches.x-100, matches.y-100) / Math.PI) % 4;
      if (data.塔位置 === undefined) data.塔位置 =[];
      let id=parseInt(matches.id,16);
      let wantID=id-26390;
      data.塔位置[weizhi]=wantID;
      
      if (data.塔位置.filter(Boolean).length === 4) {
        return  data.塔位置[0]+'      '+data.塔位置[1]+'\n'+data.塔位置[3]+'      '+data.塔位置[2]
      }
    },

  },
  {
    id: 'DSR Eyes Steep in Rage',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '68BD', source: ['Right Eye', 'Left Eye'], capture: false }),
    // Each of the eyes (if alive) will start this aoe.  It has the same id from each eye.
    suppressSeconds: 1,
    response: Responses.bigAoe('alert'),
  },
    //7:31
    {
      id: 'DSR P4Buff',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AD7', 'AD8'], capture: true }),
      condition: Conditions.targetIsYou(),
      run: (data, matches, output) => {
        if (matches.effectId === 'AD7') data.p4Buff='红';
        if (matches.effectId === 'AD8') data.p4Buff='蓝';
        return ;
        }
    },
    {
      id: 'DSR Right Eye Blue Tether',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AD7', 'AD8']}),
      delaySeconds:0.1,
      suppressSeconds:120,
      condition: Conditions.targetIsYou(),
      alertText: (data, matches, output) => {
        if (data.role=='dps')  return;
        if (data.p4Buff=='红') return '换buff';
        if (data.p4Buff=='蓝') return '不换';
        }
    },
    //7:37
    {
      id: 'DSR Left Eye Red tether',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AD7', 'AD8']}),
      delaySeconds:6,
      suppressSeconds:120,
      condition: Conditions.targetIsYou(),
      alertText: (data, matches, output) => {
        if (data.p4Buff='红') return '撞黄球';
        if (data.p4Buff='蓝') return '准备接buff';
        }
    },
   //7:44
    {
      id: 'DSR Eyes Dive Cast',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AD7', 'AD8'], capture: true }),
      delaySeconds:12,
      suppressSeconds:120,
      condition: Conditions.targetIsYou(),
      alertText: (data, matches, output) => {
        if (data.p4Buff='红') return '撞篮球';
        }
    },
    //7:46
    {
      id: 'DSR Left Eye Red tether',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['AD7', 'AD8'], capture: true }),
      delaySeconds:14,
      suppressSeconds:120,
      condition: Conditions.targetIsYou(),
      alertText: (data, matches, output) => {
       return '第1次站位'
        }
    },
    {
      id: 'P4幻想冲',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '68C4'}),
      suppressSeconds: 2,
      alertText: (data, matches, output) => {
        if (data.幻想冲===undefined) {
          data.幻想冲=1
        }
        if (data.幻想冲<4) {
          
          data.幻想冲=data.幻想冲+1;
          return '第'+data.幻想冲+'次'+'站位'
        }
  
      }
    },
    {
      id: 'DSR Right Eye Reminder',
      type: 'StartsUsing',
      // If the Right Eye is dead and the Left Eye gets the aoe off, then the Right Eye
      // will be revived and you shouldn't forget about it.
      netRegex: NetRegexes.startsUsing({ id: '68BD', source: 'Left Eye' }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Kill Right Eye',
          cn:'杀死右边红眼',
        },
      },
    },
    {
      id: 'DSR Spear of the Fury Limit Break',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62E2', source: 'Ser Zephirin', capture: false }),
      // This ability also happens in doorboss phase.
      condition: (data) => data.role === 'tank' && data.phase === 'haurchefant',
      // This is a 10 second cast, and (from video) my understanding is to
      // hit tank LB when the cast bar gets to the "F" in "Fury", which is
      // roughly 2.8 seconds before it ends.
      delaySeconds: 10 - 2.8,
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'TANK LB!!',
          de: 'TANK LB!!',
          fr: 'LB TANK !!',
          ja: 'タンクLB!!',
          cn: '坦克LB！！',
          ko: '리미트 브레이크!!',
        },
      },
    },
    {
      id: 'DSR Brightwing Counter',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6319'}),
      // One ability for each player hit (hopefully only two??)
      suppressSeconds: 1,
      infoText: (data, _matches, output) => output[`dive${data.brightwingCounter}`](),
      run: (data) => data.brightwingCounter++,
      outputStrings: {
        // Ideally folks can customize this with who needs to run in.
        dive1: Outputs.num1,
        dive2: Outputs.num2,
        dive3: Outputs.num3,
        dive4: Outputs.num4,
      },
    },
    {
      id: 'P4.5',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62E4'}),
      delaySeconds:(data,matches)=>matches.castTime-5,
      suppressSeconds: 5,
      alertText: (data, _, output) => '注意奥尔什方血量',
    },
    {
      id: '龙眼位置',
      regex: /] ChatLog 00:0:103:.{8}:8003759A:00020001:.{7}(?<index>.+?):/,
      run: (data, matches, output) => {
        if (data.龙眼 === undefined) data.龙眼 = [];
        data.eye=+matches.index;
        switch (+matches.index) {
          case 0:
            data.龙眼.push('A点');

            break;
          case 1:
            data.龙眼.push('1点');
            break;
          case 2:
            data.龙眼.push('B点');
            break;
          case 3:
            data.龙眼.push('2点');
            break;
          case 4:
            data.龙眼.push('C点');
            break;
          case 5:
            data.龙眼.push('3点');
            break;
          case 6:
            data.龙眼.push('D点');
            break;
           case 7:
            data.龙眼.push('4点');
            break;
          default:
            return '其他'
            break;
        }
       // return data.龙眼[0];
      }
    },
    {
      id: 'DSR Dragon',
      regex: /] ChatLog 00:0:103:.{8}:8003759A:00020001:.{7}(?<index>.+?):/,
      delaySeconds:(data,matches)=>{
        if (data.phase=='thordan')  return 2
        if (data.phase=='thordan2')  return 10
      },
      delaySeconds:(data,matches)=>{
        if (data.phase=='thordan')  return 2
        if (data.phase=='thordan2')  return 12
      },
      durationSeconds:15,
      promise: async (data, matches) => {
        let bossData = await callOverlayHandler({
           call: 'getCombatants',
         });
          let bossData2= bossData.combatants.filter((boss) => boss.BNpcNameID===3632&&boss.BNpcID==12611);
          if (bossData2.length>0)  bossData2=bossData2;
          else bossData2=bossData.combatants.filter((boss) => boss.BNpcNameID===3632&&boss.BNpcID==12604);
          let bossData123;
          if (data.phase=='thordan') {
            bossData123=bossData.combatants.filter((boss) => boss.BNpcNameID===3632&&boss.BNpcID==12604)[0]
          }
          if (data.phase=='thordan2') {
            bossData123=bossData.combatants.filter((boss) => boss.BNpcNameID===3632&&boss.BNpcID==12611)[0]
          }
          data.骑神=Math.round(Math.round(4 - 4 * Math.atan2(bossData123.PosX-100, bossData123.PosY-100) / Math.PI) % 8);
       },
      alertText: (data, matches, output) => {
        if (data.龙眼 === undefined) data.龙眼 = [];
        switch (data.骑神) {
          case 0:
            data.龙眼.push('A点');
            break;
          case 1:
            data.龙眼.push('1点');
            break;
          case 2:
            data.龙眼.push('B点');
            break;
          case 3:
            data.龙眼.push('2点');
            break;
          case 4:
            data.龙眼.push('C点');
            break;
          case 5:
            data.龙眼.push('3点');
            break;
          case 6:
            data.龙眼.push('D点');
            break;
           case 7:
            data.龙眼.push('4点');
            break;
          default:
            
            break;
        }
        if (data.龙眼.length==2) {
          data.背对=true;
          return '背对'+data.龙眼[0]+data.龙眼[1];}
       return data.龙眼[0];
      }
    },
    {
      id: '面相',
      netRegex: /.*?/,
      condition:(data, matches, output)=>data.背对,
      tts:null,
      suppressSeconds:0.4,
      durationSeconds:0.5,
      sound: '',
      soundVolume: 0,
      promise : async (data, matches)=>{
        const boss = await callOverlayHandler({
          call: 'getCombatants',
        });
        if (data.phase=='thordan') {
          data.骑神位置=boss.combatants.filter((boss) => boss.BNpcNameID===3632&&boss.BNpcID==12604)[0]
        }
        if (data.phase=='thordan2') {
          data.骑神位置=boss.combatants.filter((boss) => boss.BNpcNameID===3632&&boss.BNpcID==12611)[0]
        }
        return ;
      },  
      alertText:(data, matches, output)=>{
        let vector2X=data.骑神位置.PosX-data.my.PosX;let vector2Y= data.骑神位置.PosY-data.my.PosY;
        let vector1X=0;let vector1Y=1;
        let RelativeAngle=(((Math.atan2(vector2Y,vector2X)-Math.atan2(vector1Y,vector1X))*(180/Math.PI)+360+180)%360+(data.my.Heading*(180/Math.PI)+360)%360)%360;
        let 面相骑神=RelativeAngle>180 - 46&&RelativeAngle<180 + 46 ;
        let 龙眼位置=EyesPositions[+data.eye][1];
        let vector3X=龙眼位置[0]-data.my.PosX;let vector3Y=龙眼位置[1]-data.my.PosY;
        let RelativeAngle1=(((Math.atan2(vector3Y,vector3X)-Math.atan2(vector1Y,vector1X))*(180/Math.PI)+360+180)%360+(data.my.Heading*(180/Math.PI)+360)%360)%360;
        let 面相眼睛=RelativeAngle1>180 - 46&&RelativeAngle1<180 + 46 ;
        let 面相正确=面相骑神&&面相眼睛;
        let 面相=面相正确? '错误':'正确';
        return '面相'+面相;
       
      },
    },
    // {
    //   id: 'DSR Dragon\'s Gaze',
    //   type: 'StartsUsing',
    //   netRegex: NetRegexes.startsUsing({ id: '63D0'}),
    //   durationSeconds: 4.5,
    //   alertText: (data, matches, output) => {
    //     if (data.龙眼 === undefined) data.龙眼 = [];
    //     let weizhi=Math.round(4 - 4 * Math.atan2(matches.x-100, matches.y-100) / Math.PI) % 8;
    //     switch (weizhi) {
    //       case 0:
    //         data.龙眼.push('A点');

    //         break;
    //       case 1:
    //         data.龙眼.push('1点');
    //         break;
    //       case 2:
    //         data.龙眼.push('B点');
    //         break;
    //       case 3:
    //         data.龙眼.push('2点');
    //         break;
    //       case 4:
    //         data.龙眼.push('C点');
    //         break;
    //       case 5:
    //         data.龙眼.push('3点');
    //         break;
    //       case 6:
    //         data.龙眼.push('D点');
    //         break;
    //        case 7:
    //         data.龙眼.push('4点');
    //         break;
    //       default:
    //         return '其他'
    //         break;
    //     }

    //     if (data.龙眼.length==2) return '背对'+data.龙眼[0]+data.龙眼[1];
        
    //     }
    // },
    {
      id: '骑神眼位置删除',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63D0'}),
      delaySeconds:12,
      run: (data, matches, output) => {
        if (data.phase === 'thordan2')  callOverlayHandler({ call: 'PostNamazu', c: 'place', p: 'load'});
       {
        data.背对=false;
        delete data.龙眼;
       }
       }
    },
    {
      id: 'DSR Ancient Quaga',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '63C6', source: 'King Thordan', capture: false }),
      response: Responses.aoe(),
    },
  {
    id: 'P5位置',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId:'B11'}),
    delaySeconds:0.5,
    suppressSeconds: 5,
    durationSeconds:12,
    promise : async (data)=>{
      const bossData = await callOverlayHandler({
        call: 'getCombatants',
      });
       data.战士 = bossData.combatants.filter((boss) => boss.BNpcNameID===3639)[0];
      return ;  
    },
    alertText: (data, matches, output) => {
      data.月环=Math.round(Math.round(2 - 2 * Math.atan2(data.战士.PosX-100, data.战士.PosY-100) / Math.PI) % 4);

      switch (data.月环) {
        case 0:
          return 'A点月环'
          break;
      case 1:
          return 'B点月环'
          break;
      case 2:
          return 'C点月环'
          break;
      case 3:
          return 'D点月环'
          break;  
        default:
          break;
      }
    }
  },
  {
    id: 'DSR Wrath Thunderstruck',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId:'B11'}),
    suppressSeconds: 5,
    promise : async (data)=>{
      const bossData = await callOverlayHandler({
        call: 'getCombatants',
      });
       data.战士 = bossData.combatants.filter((boss) => boss.BNpcNameID===3639)[0];
      return ;
    },
    alertText: (data, matches, output) => {
      if (matches.target==data.me) return '雷点名';
    }
  },
  {
    id: 'DSR Wrath Thunderstruck Targets',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId:'B11'}),
    suppressSeconds: 5,
    delaySeconds: (data, matches) => parseFloat(matches.duration) - 5,
    alertText: (data, matches, output) => {
      if (matches.target==data.me) return '雷点名';
    }
  },
  {
    id: 'P5雷点名职业播报',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId:'B11'}),
    delaySeconds:3,
    alertText: (data, matches, output) => {
      if (data.lei === undefined) data.lei =[];
      data.lei.push(nametocnjob(matches.target,data));
      if (data.lei.length==2) {
        let 标记1=data.lei.map((i)=>data.partJob.find((j)=>j.job==i));
        sendMark(标记1[0].ID,9);sendMark(标记1[1].ID,10);
        return '雷点名'+data.lei[0]+data.lei[1]}
    }
  },
  {
    id: 'DSR Heavenly Heel',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '63C7' }),
    response: Responses.tankBusterSwap('alert', 'alert'),
  },
  {
    id: 'P5一运蓝标',
    type: 'HeadMarker',
    netRegex: NetRegexes.headMarker(),
    condition: (data, matches) => data.phase == 'thordan2',
    alertText: (data, matches, output) => {
      const id = getHeadmarkerId(data, matches);
      if( id=== headmarkers.fuchong&&data.me === matches.target)
      {
        switch (data.月环) {
          case 0:
            return '去C点放俯冲'
            break;
        case 1:
            return '去D点放俯冲'
            break;
        case 2:
            return '去A点放俯冲'
            break;
        case 3:
            return '去B点放俯冲'
            break;  
          default:
            return '俯冲点名'
            break;
        }
      }
      if (id=== headmarkers.lanbiao) {
        if (data.P5点名 === undefined) data.P5点名 =[];
        data.P5点名.push(nametocnjob(matches.target,data));
        if (data.P5点名.length===3) {
        let 要排序的数组=data.fenzu.filter((x)=>!data.P5点名.some((item) => x === item));
          要排序的数组.sort((a,b)=>{
            return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order});
            
          let isInP5点名=data.P5点名.includes(nametocnjob(data.me,data));
          let 标记1=要排序的数组.map((i)=>data.partJob.find((j)=>j.job==i));
          sendMark(标记1[0].ID,1);sendMark(标记1[1].ID,2);sendMark(标记1[2].ID,3);sendMark(标记1[3].ID,4);sendMark(标记1[4].ID,5);
          if (isInP5点名==false) return '排队'+要排序的数组[0]+要排序的数组[1]+要排序的数组[2]+要排序的数组[3]+要排序的数组[4]
        }
        
        if (data.me === matches.target)  return '去左上'
      }
    },

  },
  {
    id: 'DSR Twisting Dive',
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: '6B8B', capture: false }),
    suppressSeconds: 1,
    alertText: (_data, _matches, output) => output.text(),
    outputStrings: {
      text: {
        en: 'Twisters',
        de: 'Wirbelstürme',
        fr: 'Tornades',
        ja: '大竜巻',
        cn: '旋风',
        ko: '회오리',
      },
    },
  },
  {
    id: 'P5五连火圈',
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: '6B91'}),
    condition: Conditions.targetIsYou(),
    suppressSeconds: 10,
    alertText: (data, matches, output) => '五连火圈点名'
  },
  {
    id: 'DSR Skyblind',
    // 631A Skyblind (2.2s cast) is a targetted ground aoe where A65 Skyblind
    // effect expired on the player.
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: 'A65' }),
    condition: Conditions.targetIsYou(),
    delaySeconds: (_data, matches) => parseFloat(matches.duration),
    response: Responses.moveAway(),
  },
  {
    id: 'DSR Brightwing Move',
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: '6319', source: 'Ser Charibert' }),
    condition: Conditions.targetIsYou(),
    // Once hit, drop your Skyblind puddle somewhere else.
    response: Responses.moveAway('alert'),
  },
  {
    id: 'P5一运连线',
    type: 'Tether',
    netRegex: NetRegexes.tether({ id: '0005' }),
    promise : async (data,matches)=>{
      let boss = await callOverlayHandler({
        call: 'getCombatants',
        ids: [parseInt(matches.sourceId, 16)],
      });
      data.linePos=Math.round(4- 4 * Math.atan2(boss.combatants[0]?.PosX-100, boss.combatants[0]?.PosY-100) / Math.PI+4) % 8;
      return ;
    },
    alertText: (data, matches, output) => {
      const dirs = {
        0: 'A点',
        1: '1点',
        2: 'B点',
        3: '2点',
        4: 'C点',
        5: '3点',
        6: 'D点',
        7: '4点',
        8: output.unknown(),
      };
      if (data.P5点名 === undefined) data.P5点名 =[];
      data.P5点名.push(nametocnjob(matches.target,data));
      if(data.me === matches?.target)
      {
      return output.direction({
        dir:dirs[data.linePos ?? 8],
      });
    }
    },
    outputStrings: {
      north: Outputs.north,
      northeast: Outputs.northeast,
      east: Outputs.east,
      southeast: Outputs.southeast,
      south: Outputs.south,
      southwest: Outputs.southwest,
      west: Outputs.west,
      northwest: Outputs.northwest,
      unknown: Outputs.unknown,
      direction: {
        en: 'go to${dir}',
        de: '${dir}',
        fr: '${dir}',
        ja: '${dir}',
        cn: '去${dir}',
        ko: '${dir}',
      },
    },

  },

  {
    id: 'DSR白龙位置',
    type: 'Ability',
    netRegex: NetRegexes.ability({ id: '6B89' }),
    tts:null,
    delaySeconds: 4.7,
    promise: async (data, matches) => {
     let whiteDragons = await callOverlayHandler({
        call: 'getCombatants',
      });

      data.whiteDragon = whiteDragons.combatants.filter((boss) => boss.BNpcNameID===3984)[0];
    },
    alertText: (data, matches, output) => {
      let weizhi=Math.round(2- 2 * Math.atan2(data.whiteDragon.PosX-100, data.whiteDragon.PosY-100) / Math.PI) % 4;
      switch (weizhi) {
        case 0:
          return '白龙在A'
          break;
        case 1:
          return '白龙在B'
          break;
       case 2:
          return '白龙在C'
          break;
       case 3:
          return '白龙在D'
          break;
        default:
          break;
      }
    },

  },
  {
    id: 'DSRp5二运战士',
    type: 'AddedCombatant',
    netRegex: NetRegexes.addedCombatantFull({ npcBaseId:'9020',npcNameId:'3641' }),
    alertText: (data, matches, output) => {
      let mark=getMark(7);
      if (data.phase === 'thordan2') {
        callOverlayHandler({ call: 'PostNamazu', c: 'place', p: 'save'});
        callOverlayHandler({ call: 'PostNamazu', c: 'place', p: mark});
      }
     
      let weizhi=Math.round(2- 2 * Math.atan2(matches.x-100, matches.y-100) / Math.PI) % 4;
      switch (weizhi) {
        case 0:
          return '战士在A'
          break;
        case 1:
          return '战士在B'
          break;
       case 2:
          return '战士在C'
          break;
       case 3:
          return '战士在D'
          break;
        default:
          break;
      }
    },

  },
  {
    id: 'DSRp5二运战士第二次播报',
    type: 'AddedCombatant',
    netRegex: NetRegexes.addedCombatantFull({ npcBaseId:'9020',npcNameId:'3641' }),
    delaySeconds:11,
    durationSeconds:14,
    condition: (data, matches) => data.phase === 'thordan2',
    alertText: (data, matches, output) => {
      let weizhi=Math.round(2- 2 * Math.atan2(matches.x-100, matches.y-100) / Math.PI) % 4;
      switch (weizhi) {
        case 0:
          return '战士在A'
          break;
        case 1:
          return '战士在B'
          break;
       case 2:
          return '战士在C'
          break;
       case 3:
          return '战士在D'
          break;
        default:
          break;
      }
    },

  },
  {
    id: 'DSR Doom Gain',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId:'BA0'}),
    alertText: (data, matches, output) => {
      if (data.death === undefined) data.death =[];
      data.death.push(nametocnjob(matches.target,data));
      if (matches.target==data.me) data.isDeath=true;
      if (data.death.length==4) {
        data.death.sort((a,b)=>{
          return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order});
        let 标记1=data.death.map((i)=>data.partJob.find((j)=>j.job==i));
        let notDianMing=data.fenzu.filter((x)=>!data.death.some((item) => x === item)); 
        notDianMing.sort((a,b)=>{
          return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order});
        let 标记2=notDianMing.map((i)=>data.partJob.find((j)=>j.job==i));
        sendMark(标记1[0].ID,1);sendMark(标记1[1].ID,2);sendMark(标记1[2].ID,3);sendMark(标记1[3].ID,4);
        sendMark(标记2[0].ID,6);sendMark(标记2[1].ID,7);sendMark(标记2[2].ID,8);sendMark(标记2[3].ID,9);
        //分组为 mtd1 std2
        //      h1d3  h2d4
        let 死宣分组=[[data.fenzu[0],data.fenzu[2]],[data.fenzu[4],data.fenzu[6]],[data.fenzu[5],data.fenzu[7]],[data.fenzu[1],data.fenzu[3]]];
        let 我的死宣=死宣分组.findIndex((i)=>i.includes(nametocnjob(data.me,data)));
          let 死宣在数组位置=data.death.map((i)=>死宣分组.findIndex((j)=>j.includes(i)));
          死宣在数组位置.sort((a,b)=>a-b);
          let 我的=死宣在数组位置.filter((i)=>i==我的死宣);
          let bobao='';
          console.log('死宣');
          console.log(data.fenzu);
          console.log(死宣在数组位置); console.log(我的死宣);console.log(data.death);
          let 重复的元素= 死宣在数组位置.filter((e,i) => 死宣在数组位置.indexOf(e)!==死宣在数组位置.lastIndexOf(e) && 死宣在数组位置.indexOf(e)===i)[0];
          if (死宣在数组位置[0]==死宣在数组位置[1]&&死宣在数组位置[2]==死宣在数组位置[3]) {
            //情况3
            if (死宣在数组位置[3]-死宣在数组位置[0]==2) { 
              bobao= '上下换位'
              if (我的死宣%2==0) data.我要去的位置=(我的死宣+3)%4;
              else data.我要去的位置=(我的死宣+1)%4;

            }
            //情况2
            if (死宣在数组位置[3]-死宣在数组位置[0]==1||死宣在数组位置[3]-死宣在数组位置[0]==3) {
              bobao= '左右互换'
              if (我的死宣%2==0) data.我要去的位置=(我的死宣+1)%4;
              else data.我要去的位置=(我的死宣+3)%4;
            }
          };
          //情况1
          if (我的.length===2||我的.length===0) {
            let dir=[0,1,2,3];
            let 要移动的位置=dir.filter((x)=>!死宣在数组位置.some((item) => x === item)); 
            let 移动次数=要移动的位置-重复的元素;
            if (Math.abs(移动次数)==2) { 
            bobao='斜点交换'
            data.我要去的位置=(我的死宣+2)%4
            
            }
            else{
              if (死宣在数组位置.includes((重复的元素+1)%4)) {
                if (我的.length===0) {
                  data.我要去的位置=(我的死宣+1)%4;
                bobao='顺时针(左)换'
                }
                if (我的.length===2) {
                  data.我要去的位置=(我的死宣+3)%4;
                bobao='逆时针(右)换'
                }
            }
            else {
              if (我的.length===0) {
                data.我要去的位置=(我的死宣+3)%4;
              bobao='逆时针(右)换'
              }
              if (我的.length===2) {
                data.我要去的位置=(我的死宣+1)%4;
              bobao='顺时针(左)换'
              }
            }
            }
          };
          if (bobao=='') {
            data.我要去的位置=我的死宣;
            return '不用换位'
          }
        if (data.role!=='dps') {
          return bobao
        }
        else {
          data.我要去的位置=我的死宣;
          return '不用换位'
        }
        }
    }
  },
  {
    id: 'P5死宣去哪',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId:'BA0'}),
    delaySeconds:1.5,
    suppressSeconds:4,
    alertText: (data, matches, output) => {
      if (data.我要去的位置==0&&data.isDeath) return '去左上边缘'
      if (data.我要去的位置==1&&data.isDeath) return '去右上边缘'
      if (data.我要去的位置==2&&data.isDeath) return '去右边靠内'
      if (data.我要去的位置==3&&data.isDeath) return '去左边靠内'
      if (data.我要去的位置==0) return '去左边边缘'
      if (data.我要去的位置==1) return '去右边边缘'
      if (data.我要去的位置==2) return '去右下边边缘'
      if (data.我要去的位置==3) return '去左下边边缘'
    }
  },
  {
    id: 'DSR Playstation2 Fire Chains',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId:'BA0'}),
    delaySeconds:12,
    suppressSeconds:4,
    alertText: (data, matches, output) => {
      if (data.我要去的位置==0&&data.isDeath) return '去左下靠内'
      if (data.我要去的位置==1&&data.isDeath) return '去右下靠内'
      if (data.我要去的位置==2&&data.isDeath) return '去右边靠外引导'
      if (data.我要去的位置==3&&data.isDeath) return '去左边靠外引导'
      else return '去上边'
    }
  },
  {
    id: 'DSR Dragon\'s Gaze',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '63D0'}), 
    disabled:true,
    response: Responses.lookAway('alert'),
  },
  {
    id: 'DSR P5索尼',
    type: 'HeadMarker',
    netRegex: NetRegexes.headMarker(),
    condition: (data, matches) => data.phase === 'thordan2' && data.me === matches.target,
    alertText: (data, matches, output) => {
      const id = getHeadmarkerId(data, matches);
      if (id === headmarkers.firechainCircle)
      {
         return '去左右'
      }
        
      if (id === headmarkers.firechainTriangle)
      {
        if (data.isDeath) return '去右下'
        else return '去左上'
      }
        
      if (id === headmarkers.firechainSquare)
      {
        if (data.isDeath) return '去左下'
        else return '去右上'
      }
        
      if (id === headmarkers.firechainX)
      {
        return '去上下'
      }
        
    },
  },
  {
    id: 'P6连线',
    type: 'Tether',
    netRegex: NetRegexes.tether({ id: ['00C4', '00C3','00C2'] }),
    condition: (data, matches) => matches.source === data.me,
    suppressSeconds:6,
    promise : async (data,matches)=>{
      const lineBOSS   = await callOverlayHandler({
        call: 'getCombatants',
        ids: [parseInt(matches.targetId, 16)],
      });
       data.lineBOSS = lineBOSS.combatants[0];
      return ;
    },
    alertText: (data, matches, output) => {
      let weizhi=Math.round(2- 2 * Math.atan2(data.lineBOSS.PosX-100, data.lineBOSS.PosY-100) / Math.PI) % 4;
      
      if (weizhi==1) return '冰线点名'
      if (weizhi==3) return '红线点名'
      return 'ceshi'
    }
  },
  // {
  //   id: '黑龙ID',
  //   // 63C4 Is Thordan's --middle-- action, thordan jumps again and becomes untargetable, shortly after the 2nd 6C34 action
  //   type: 'Ability',
  //   netRegex: NetRegexes.startsUsing({ id:  '6D43'}),
  //   promise: async (data, matches) => {
  //     let npcCombatants = await callOverlayHandler({
  //       call: 'getCombatants',
  //       names: [matches.source],
  //     });
  //     data.BlackDragon=npcCombatants.combatants[0];
      
  //     return ;
  //   },
  // },
  {
    id: 'DSR Hallowed Wings and Plume',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id:  ['6D23', '6D24','6D26','6D27']}),
    //condition: (data) => (data.phase === 'thordan2' && (data.safe = (data.safe ?? 0) + 1) === 1),
    condition:(data) => !data.fire ,
    delaySeconds:0.1,
    promise : async (data)=>{
      const BlackDragon = await callOverlayHandler({
        call: 'getCombatants',
      });
       data.BlackDragon = BlackDragon.combatants.filter((boss) => boss.BNpcNameID===3458&&boss.BNpcID==12612)[0];
      return ;
    },
    alertText:(data, matches, output) =>{
      let posX=data.BlackDragon.PosX;
      if (matches.id =='6D23'||matches.id =='6D26') {
        if (data.role=='tank') data.靠近或远离1='靠近右边boss';
        else data.靠近或远离1='远离右边boss';
      }
      if (matches.id =='6D24'||matches.id =='6D27') {
        if (data.role=='tank') data.靠近或远离1='远离右边boss';
        else data.靠近或远离1='靠近右边boss';
      }
      if (matches.id === '6D26'||matches.id === '6D27') {
        if(posX<100) data.翅膀1='去右下'
        if(posX>100) data.翅膀1= '去左下'
        
      } 
      if (matches.id === '6D23'||matches.id === '6D24') {
        if(posX<100) data.翅膀1='去右上'
        if(posX>100) data.翅膀1='去左上'
      }
      if (data.靠近或远离1&&data.翅膀1) return data.翅膀1+data.靠近或远离1;
 
    },

  },

  {
    id: 'DSRp6火球',
    type: 'AddedCombatant',
    netRegex: NetRegexes.addedCombatantFull({ npcBaseId:'13238' }),
    suppressSeconds:1,
    promise : async (data)=>{
      const WhiteDragon = await callOverlayHandler({
        call: 'getCombatants',
      });
       data.WhiteDragon = WhiteDragon.combatants.filter((boss) => boss.BNpcNameID===4954&&boss.BNpcID==12613)[0];
      return ;
    },
    alertText: (data, matches, output) => {
      if ((data.fire = (data.fire?? 0) + 1) === 2) {
        let posX=data.WhiteDragon.PosX;
        console.log(posX+':'+matches.y);
        console.log(data.fire)
      if (posX>=100&&+matches.y>106) return '左上安全';
      if (posX>=100&&+matches.y<106) return '左下安全';
      if (posX<=91&&+matches.y>106) return '右上安全';
      if (posX<=91&&+matches.y<106) return '右下安全';
      } 
    },

  },
  {
    id: 'DSR Akh Afah',
    // 6D41 Akh Afah from Hraesvelgr, and 64D2 is immediately after
    // 6D43 Akh Afah from Nidhogg, and 6D44 is immediately after
    // Hits highest emnity target
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: ['6D41', '6D43']}),
    suppressSeconds: 2,
    infoText: (_data, _matches, output) => {
      _data.分摊次数++;
     return output.groups();
    },
    outputStrings: {
      groups: {
        en: 'Tank Groups',
        ja: 'タンクと頭割り',
        ko: '탱커와 그룹 쉐어',
        cn: '上下分摊',
      },
    },
  },
  {
    id: 'DSR 发光位置收集',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id:  ['6D35', '6D33']}),  
    delaySeconds:10,
    preRun:(data, matches, output) =>{
      let weizhi=data.位置=Math.round(2- 2 * Math.atan2(matches.x-100, matches.y-100) / Math.PI) % 4;
      if (data.发光位置 === undefined) data.发光位置 = [];
      data.发光位置 .push(weizhi);
    },
    run:(data)=>delete data.发光位置

  },
  {
    id: 'DSR 发光位置播报',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id:  ['6D35', '6D33']}),  
    delaySeconds:0.5,
    suppressSeconds: 5,
    alertText:(data, matches, output) =>{
      if (data.role!=='tank') return;
      if (data.发光位置.length===2) return '双龙发光';
      if (data.发光位置.length===1) {
        if (data.发光位置[0]===1) return '黑龙死刑';
        else return '白龙死刑';
      }
    }
  },
  // {
  //   id: '双T靠近/人群远离',
  //   type: 'StartsUsing',
  //   netRegex: NetRegexes.startsUsing({ id:  ['6D23', '6D26']}),  
  //   delaySeconds:0.5,
  //   suppressSeconds: 5,
  //   alertText:(data, matches, output) =>{
  //     if (data.role=='tank') return '靠近右边boss';
  //     else return '远离右边boss';
  //   }
  // },
  // {
  //   id: '双T远离/人群靠近',
  //   type: 'StartsUsing',
  //   netRegex: NetRegexes.startsUsing({ id:  ['6D24', '6D27']}),  
  //   delaySeconds:0.5,
  //   suppressSeconds: 5,
  //   alertText:(data, matches, output) =>{
  //     if (data.role=='tank') return '远离右边boss';
  //     else return '靠近右边boss';
  //   }
  // },
  {
    id: 'DSR Spreading Flame',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['AC6', 'AC7'], capture: true }),
    run: (data, matches, output) => {
      if (data.dark === undefined) data.dark =[];
      if (data.white === undefined) data.white =[];
      if (matches.effectId === 'AC6') {
        data.dark.push(nametocnjob(matches.target,data));
        if (matches.target==data.me) data.p6buff='暗';
        return 
      }
      if (matches.effectId === 'AC7') {
        data.white.push(nametocnjob(matches.target,data));
        if (matches.target==data.me) data.p6buff='白';
        return 
      }
      }
  },
  {
    id: 'DSR Entangled Flame',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['AC6', 'AC7'], capture: true }),
    delaySeconds:3,
    suppressSeconds:3,
    //delaySeconds: (data, matches) => parseFloat(matches.duration) - 5,
    run: (data, matches, output) => {
      data.dark.sort((a,b)=>{
        return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order});
        data.white.sort((a,b)=>{
          return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order});
       data.noBuff=data.fenzu.filter((x)=>(!data.dark.some((item) => x === item)&&(!data.white.some((item) => x === item))));
       data.noBuff.sort((a,b)=>{
        return shunxu2.find((c)=>c.job==a).order-shunxu2.find((c)=>c.job==b).order});
      let 标记1=data.dark.map((i)=>data.partJob.find((j)=>j.job==i));
      let 标记2=data.white.map((i)=>data.partJob.find((j)=>j.job==i));
      let notDianMing=data.noBuff.map((i)=>data.partJob.find((j)=>j.job==i));
      sendMark(标记1[0].ID,1);sendMark(标记1[1].ID,2);sendMark(标记1[2].ID,3);sendMark(标记1[3].ID,4);
      sendMark(标记2[0].ID,6);sendMark(标记2[1].ID,7)
      sendMark(notDianMing[0].ID,9);sendMark(notDianMing[1].ID,10);
      }
  },
  {
    id: 'P6传毒',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['B50'], capture: true }),
    suppressSeconds:5,
    delaySeconds: (data, matches) => parseFloat(matches.duration) - 4,
    suppressSeconds:2,
    preRun:(data, matches, output) => data.传毒次数++,
    infoText: (data, matches, output) => {

      if (data.传毒次数==1) {
        data.毒分组=[data.fenzu[2],data.fenzu[6],data.fenzu[3],data.fenzu[7]];
        let 第一次毒点名=nametocnjob(matches.target,data);
        data.第一次点名顺序=data.毒分组.indexOf(第一次毒点名);
        console.log(data.毒分组);
        console.log('毒');
        console.log(data.第一次点名顺序);
        let 标记1=data.partJob.find((j)=>j.job==第一次毒点名);
        let 标记2=data.partJob.find((j)=>j.job==data.fenzu[4]);
        sendMark(标记1.ID,11);sendMark(标记2.ID,12)
        return '传毒给'+data.fenzu[4];
      }
      let 播报=(data.第一次点名顺序+data.传毒次数-1)%4;
      if (data.传毒次数==2) {
        let 标记1=data.partJob.find((j)=>j.job==data.fenzu[4]);
        let 标记2=data.partJob.find((j)=>j.job==data.毒分组[播报]);
       // sendMark(标记1.ID,11);sendMark(标记2.ID,12)
        return '传毒给'+data.毒分组[播报]
      }

      let 标记1=data.partJob.find((j)=>j.job==data.毒分组[播报-1]);
      let 标记2=data.partJob.find((j)=>j.job=data.毒分组[播报]);
      sendMark(标记1.ID,11);sendMark(标记2.ID,12)
      if (data.传毒次数==3) return '传毒给'+data.毒分组[播报]
      if (data.传毒次数==4) return '传毒给'+data.毒分组[播报]
      if (data.传毒次数==5) return '传毒给'+data.毒分组[播报]
      return data.传毒次数+'传毒'
      }
  },
  {
    id: '辣翅辣味',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id:  ['6D2B', '6D2D']}),  
    suppressSeconds: 5,
    condition: (data) => ((data.辣翅辣味 = (data.辣翅辣味 ?? 0) + 1) === 1),
    alertText:(data, matches, output) =>{

       let 黑位置=data.dark.includes(data.myJob)?data.dark.indexOf(data.myJob)+1:'';
       let 白位置=data.white.includes(data.myJob)?data.white.indexOf(data.myJob)+1:'';
       let 无点名位置=data.noBuff.includes(data.myJob)?data.noBuff.indexOf(data.myJob)+1:'';
      if (matches.id=='6D2D') 
      {
        if (data.dark.includes(data.myJob)) { 
          return '去两侧第'+黑位置+'分散'
        }
        if (data.white.includes(data.myJob)) {
          return '去两侧第'+白位置+'分摊'
        }
        if (data.noBuff.includes(data.myJob)) {
          return '去两侧第'+无点名位置+'分摊'
        }
      }
      if (matches.id=='6D2B')
      {
        if (data.dark.includes(data.myJob)) { 
          return '去中间第'+黑位置+'分散'
        }
        if (data.white.includes(data.myJob)) {
          return '去中间第'+白位置+'分摊'
        }
        if (data.noBuff.includes(data.myJob)) {
          return '去中间第'+无点名位置+'分摊'
        }
      }
    }
  },
  {
    id: '辣翅辣味2',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id:  ['6D2B', '6D2D','6D23', '6D24','6D26','6D27']}),  
    condition:(data) => data.分摊次数>=2,
    alertText:(data, matches, output) =>{
      console.log('分摊次数:'+data.分摊次数);
      if (matches.id=='6D2D') 
      {
        data.辣翅辣味安全位置='去两侧';
      }
      if (matches.id=='6D2B')
      {
        data.辣翅辣味安全位置='去中间';
      }
      if (matches.id =='6D23'||matches.id =='6D26') {
        if (data.role=='tank') data.靠近或远离='靠近';
        else data.靠近或远离='远离';
      }
      if (matches.id =='6D24'||matches.id =='6D27') {
        if (data.role=='tank') data.靠近或远离='远离';
        else data.靠近或远离='靠近';
      }
      if (matches.id === '6D26'||matches.id === '6D27') {
        data.翅膀='下边'
      }
      if (matches.id === '6D23'||matches.id === '6D24') {
        data.翅膀='上边'
      }
      if (data.辣翅辣味安全位置&&data.翅膀&&data.靠近或远离) 
      return  data.辣翅辣味安全位置+data.翅膀+data.靠近或远离;
      
    }
  },
  {
    id: 'DSR Wyrmsbreath 2 Boiling and Freezing',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({ effectId: ['B52', 'B53'] }),
    condition: Conditions.targetIsYou(),
    // Lasts 10.96s, but bosses do not cast Cauterize until 7.5s after debuff
    delaySeconds: 7.6,
    promise : async (data)=>{
      const BlackDragon = await callOverlayHandler({
        call: 'getCombatants',
      });
       data.BlackDragon = BlackDragon.combatants.filter((boss) => boss.BNpcNameID===3458&&boss.BNpcID==12612)[0];
      return ;
    },  
    infoText: (data, matches, output) => {
      console.log(data.BlackDragon);
      if (matches.effectId === 'B52'){
        if (data.BlackDragon.PosX>100) return '去左边停下'
        else return '去右边停下'
      }
      else{
          if (data.BlackDragon.PosX>100) return '去右边'
          else return '去左边'
      }
    },

  },
  {
    id: 'DSR Wyrmsbreath 2 Pyretic',
    type: 'GainsEffect',
    // B52 = Boiling
    // When Boiling expires, Pyretic (3C0) will apply
    // Pyretic will cause damage on movement
    netRegex: NetRegexes.gainsEffect({ effectId: ['B52'] }),
    condition: Conditions.targetIsYou(),
    // Boiling lasts 10.96s, after which Pyretic is applied provide warning
    delaySeconds: (_data, matches) => parseFloat(matches.duration) - 1,
    // Player will have Pyretic for about 3s before hit by Cauterize
    durationSeconds: 4,
    infoText: (_data, _matches, output) => output.text(),
    outputStrings: {
      text: {
        en: 'Stop',
        de: 'Stopp',
        fr: 'Stop',
        ja: '動かない',
        cn: '停停停',
        ko: '멈추기',
      },
    },
  },
  {
    id: 'DSR Trinity Tank Dark Resistance',
    type: 'GainsEffect',
    // C40 = Dark Resistance Down, highest enmity target
    netRegex: NetRegexes.gainsEffect({
      effectId: 'C40',
      count: '02',
    }),
    condition: (data, matches) => data.me === matches.target,
    alertText: (_data, matches, output) => {
      if (parseFloat(matches.duration) > 10)
        return output.text();
    },
    outputStrings: {
      text: {
        // Only showing 'swap' is really confusing, in my opinion
        en: 'Get 2nd enmity',
        de: 'Sei 2. in der Aggro',
        ko: '적개심 2순위 잡기',
        cn: '获取2仇',
      },
    },
  },
  {
    id: 'DSR Trinity Tank Dark Resistance',
    type: 'GainsEffect',
    // C40 = Dark Resistance Down, highest enmity target
    netRegex: NetRegexes.gainsEffect({
      effectId: 'C40',
      count: '02',
    }),
    condition: (data, matches) => data.me === matches.target,
    alertText: (_data, matches, output) => {
      if (parseFloat(matches.duration) > 10)
        return output.text();
    },
    outputStrings: {
      text: {
        // Only showing 'swap' is really confusing, in my opinion
        en: 'Get 2nd enmity',
        de: 'Sei 2. in der Aggro',
        ko: '적개심 2순위 잡기',
        cn: '获取2仇',
      },
    },
  },
  {
    id: 'DSR Trinity Tank Light Resistance',
    type: 'GainsEffect',
    // C3F = Light Resistance Down, 2nd highest enmity target
    netRegex: NetRegexes.gainsEffect({
      effectId: 'C3F',
      count: '02',
    }),
    condition: (data, matches) => data.me === matches.target,
    // To prevent boss rotating around before Exaflare
    delaySeconds: 2.5,
    alertText: (_data, matches, output) => {
      if (parseFloat(matches.duration) > 10)
        return output.text();
    },
    outputStrings: {
      text: {
        en: 'Provoke',
        de: 'Herausforderung',
        ko: '도발하기',
        cn: '挑衅',
      },
    },
  },
  {
    id: 'P7钢铁月环',
    type: 'GainsEffect',
    netRegex: NetRegexes.gainsEffect({
      effectId: '808',
      count: ['12A','12B'],
    }),
    durationSeconds:10,
    alertText: (data, matches, output) => {
      if (matches.count=='12A') return '钢铁'
      else return '月环'
    },
  },
  {
    id: 'P7顺逆',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id:  ['6D9A', '6DD2','6DD3']}),  
    durationSeconds:15,
    promise : async (data)=>{
      const bossData = await callOverlayHandler({
        call: 'getCombatants',
      });
      data.核爆=bossData.filter((a=>a.ID== parseInt(matches.sourceId, 16)))[0];
    },
    alertText:(data, matches, output) =>{
      let posX=data.核爆.PosX;let PosY=data.核爆.PosY;
      if (data.核爆 === undefined) data.核爆 = [];
      let 方位=Math.round(4 - 4 * Math.atan2(posX-100, PosY-100) / Math.PI) % 8;
      if (matches.id=='6D9A') {
        data.核爆[0]=方位;
      }
      if (matches.id=='6DD2') {
        data.核爆[1]=方位;
      }
      if (data.核爆.length>=2) {
        let 核爆位置;
      switch (data.核爆[0]) {
        case 0:
          核爆位置='下'
          break;
        case 1:
            核爆位置='左下'
          break;
        case 2:
         核爆位置='左'
          break;
        case 3:
         核爆位置='左上'
        break;
        case 4:
         核爆位置='上'
        break;
        case 5:
         核爆位置='右上'
        break;
        case 6:
          核爆位置='右'
         break;
        case 7:
          核爆位置='右下'
        break;
        default:
          break;
      }
      let 顺逆=data.核爆[1]-data.核爆[0];
      if (顺逆>0||顺逆==-5) data.核爆顺逆= '顺时针(左)核爆'
      else data.核爆顺逆= '逆时针(右)核爆'
      if (核爆位置&&data.核爆顺逆)  return data.核爆顺逆+'核爆'+核爆位置
      }

    }
  },
  {
    id: 'P7顺逆删除',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id:  ['6D9A', '6DD2']}),  
    suppressSeconds: 1,
    delaySeconds:10,
    run:(data, matches, output) =>{
      delete data.核爆
    }
  },
  {
    id: 'P7第一次三位一体D1引导',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '6D9B'}),
    delaySeconds:11,
    alertText:(data, matches, output) =>{
      data.myIndex=data.fenzu.indexOf(data.myJob);
      if (data.role=='tank') return
      if (data.myIndex==2) return '靠近引导顺劈'
      else return '远离BOSS'
    }
  },
  {
    id: 'P7第一次三位一体D2引导',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '6D9B'}),
    delaySeconds:15,
    alertText:(data, matches, output) =>{
      if (data.role=='tank') return
      if (data.myIndex==6) return '靠近引导顺劈'
      else return '远离BOSS'
    }
  },
  {
    id: 'P7第一次三位一体H1引导',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '6D99'}),
    delaySeconds:22,
    alertText:(data, matches, output) =>{
      if (data.role=='tank') return
      if (data.myIndex==1) return '靠近引导顺劈'
      else return '远离BOSS'
    }
  },
  {
    id: 'P7第一次三位一体H2引导',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '6D99'}),
    delaySeconds:26,
    alertText:(data, matches, output) =>{
      if (data.role=='tank') return
      if (data.myIndex==5) return '靠近引导顺劈'
      else return '远离BOSS'
    }
  },
  {
    id: 'P7第一次三位一体D3引导',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '6D93'}),
    delaySeconds:14,
    alertText:(data, matches, output) =>{
      if (data.role=='tank') return
      if (data.myIndex==3) return '靠近引导顺劈'
      else return '远离BOSS'
    }
  },
  {
    id: 'P7第一次三位一体D4引导',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id: '6D93'}),
    delaySeconds:18,
    alertText:(data, matches, output) =>{
      if (data.role=='tank') return
      if (data.myIndex==7) return '靠近引导顺劈'
      else return '远离BOSS'
    }
  },
  {
    id: 'P7地火第一次标记',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id:  '6D9C'}),
    promise : async (data)=>{
      const bossData = await callOverlayHandler({
        call: 'getCombatants',
      });
       data.P7BOSS = bossData.combatants.filter((boss) => boss.BNpcNameID===11319&&boss.BNpcID==12616)[0];
       //console.log(data.P7BOSS);
    },
    alertText:(data, matches, output) =>{
      let Boss面相=Math.round(4 - 4 * parseFloat(data.P7BOSS.Heading) / Math.PI) % 8;
      let 地火位置=Math.round(4 - 4 * Math.atan2(matches.x-100, matches.y-100) / Math.PI) % 8;
      if ((Boss面相+4)%8==地火位置) {
        console.log(Boss面相+':'+地火位置);
        let waymark = {
          One: {
            X: matches.x,
            Y: matches.z,
            Z: matches.y,
            Active: true
          },
      };
      callOverlayHandler({ call: 'PostNamazu', c: 'place', p: JSON.stringify(waymark)});
      return '站在下面地火旁'
      }
      
    }
  },
  //吉吉的穷举
  {
    id: 'P7地火形状',
    type: 'StartsUsing',
    netRegex: NetRegexes.startsUsing({ id:  '6D9C'}),
    promise : async (data,matches)=>{
      const bossData = await callOverlayHandler({
        call: 'getCombatants',
      });
       data.P7BOSS = bossData.combatants.filter((boss) => boss.BNpcNameID===11319&&boss.BNpcID==12616)[0];
       //data.地火=bossData.combatants.filter((boss) =>boss.ID==parseInt(matches.targetId, 16))[0];
       //console.log(data.地火);
    },
    alertText:(data, matches, output) =>{
      let Boss面相=Math.round(4 - 4 * parseFloat(data.P7BOSS.Heading) / Math.PI) % 8;
      let 地火位置=Math.round(4 - 4 * Math.atan2(matches.x-100, matches.y-100) / Math.PI) % 8;
      console.log(matches);
      console.log(地火位置);
      console.log(Boss面相);
      //console.log(data.地火);
      if ((地火位置+9)%8==Boss面相) {
        data.左上地火=Math.round(4 - 4 * matches.heading/ Math.PI+8-Boss面相) % 8;
      }
      if ((地火位置+7)%8==Boss面相) {
        data.右上地火=Math.round(4 - 4 * matches.heading/ Math.PI+8-Boss面相) % 8;
      }
      if ((地火位置+4)%8==Boss面相) {
        data.下面地火=Math.round(4 - 4 * matches.heading/ Math.PI+8-Boss面相) % 8;
        }
        console.log('地火');
        console.log(data.下面地火+':'+data.右上地火+':'+data.左上地火);
      if (data.下面地火!==undefined&&data.右上地火!==undefined&&data.左上地火!==undefined) {
        if (/[02346]/.test(data.下面地火)&&/[12357]/.test(data.右上地火)) return '左上安全';
        if (/[02456]/.test(data.下面地火)&&/[13567]/.test(data.左上地火)) return '右上安全';
        if (/[01246]/.test(data.右上地火)&&/[02467]/.test(data.左上地火)) return '背后安全';
        else return '无安全点'
      } 
    }
  },
  {
    id: 'P7地火第二次标记',
    type: 'StartsUsing',
    netRegex: NetRegexes.ability({ id:  '6D9C'}),
    suppressSeconds:1,
    alertText:(data, matches, output) =>{
        let mark=getMark(13.2);
        callOverlayHandler({ call: 'PostNamazu', c: 'place', p: mark});
        return '走走走'
    }
  },
  {
    id: 'P7地火标点恢复',
    type: 'StartsUsing',
    netRegex: NetRegexes.ability({ id:  '6D9C'}),
    suppressSeconds:1,
    delaySeconds:7,
    run:(data, matches, output) =>{
      delete data.下面地火;delete data.右上地火;delete data.左上地火;
        callOverlayHandler({ call: 'PostNamazu', c: 'place', p: 'load'});
    }
  },
  ],
  timelineReplace: [

    {
      'locale': 'cn',
      'replaceSync': {
        '(?<!Dragon-)King Thordan': '.*?',
        'Ser Adelphel': '.*?',
        'Ser Charibert': '.*?',
        'Ser Grinnaux': '.*?',
        'Ser Guerrique': '.*?',
        'Ser Hermenost': '.*?',
        'Ser Ignasse': '.*?',
        'Ser Janlenoux': '.*?',
        'Ser Zephirin': '.*?',
        'Nidhogg':'.*?',
        'Hraesvelgr':'.*?',
        'Darkscale':'.*?',
        'Vedrfolnir':'.*?',
        'Right Eye':'.*?',
        'Ser Noudenet':'.*?',
        'Left Eye:':'.*?',
        'Dragon-king Thordan':'.*?',
      },
      'replaceText': {
        'Ancient Quaga': '古代爆震',
        'Ascalon\'s Mercy Concealed': '无形・阿斯卡隆之仁',
        'Ascalon\'s Might': '阿斯卡隆之威',
        'Brightblade\'s Steel': '光辉剑的觉悟',
        'Brightwing(?!ed)': '光翼闪',
        'Brightwinged Flight': '苍穹光翼',
        'Conviction': '信仰',
        'Dimensional Collapse': '空间破碎',
        'Empty Dimension': '空维空间斩',
        'Execution': '处刑',
        'Faith Unmoving': '坚定信仰',
        'Full Dimension': '全空间',
        'Heavenly Heel': '天踵',
        'Heavensblaze': '苍穹吐息',
        'Heavensflame': '天火',
        'Heavy Impact': '沉重冲击',
        'Holiest of Holy': '至圣',
        'Holy Bladedance': '圣光剑舞',
        'Holy Shield Bash': '圣盾猛击',
        'Hyperdimensional Slash': '多维空间斩',
        'Knights of the Round': '圆桌骑士',
        'Lightning Storm': '百雷',
        'Planar Prison': '空间牢狱',
        'Pure of Heart': '纯洁心灵',
        'Skyblind': '苍穹刻印',
        'Skyward Leap': '穿天',
        'Spear of the Fury': '战女神之枪',
        'Spiral Thrust': '螺旋刺',
        'Strength of the Ward': '苍穹之阵：雷枪',
        'The Bull\'s Steel': '战争狂的觉悟',
        'The Dragon\'s Rage': '邪龙魔炎',
        'Sanctity of the Ward': '苍穹之阵：圣杖',
        'Sacred Sever': '神圣斩击',
        'The Dragon\'s Glory': '邪龙目光',
        'Heavens\' Stake': '苍穹钉',
        'Hiemal Storm': '严冬风暴',
        'Holy Comet': '神圣彗星',
        'Ultimate End': '万物终结',
        'Broad Swing': '奋力一挥',
        'Aetheric Burst Enrage': '以太爆发',
        'Final Chorus': '灭绝之诗',
        'Dive from Grace': '堕天龙炎冲',
        'Lash and Gnash/Gnash and Lash': '牙尾二连旋',
        'Tower': '黑暗高跳',
        'Eye of the Tyrant': '暴君之瞳',
        'Darkdragon Dive': '黑暗龙炎冲',
        'Geirskogul': '武神枪',
        'Drachenlance': '腾龙枪',
        'Soul Tether': '追魂炮',
        'Revenge of the Horde Enrage': '绝命怒嚎',
        'Hatebound': '邪龙爪牙',
        'Flare Nova': '核爆灾祸',
        'Flare Star': '耀星',
        'Mirage Dive': '幻象冲',
        'Steep in Rage': '愤怒波动',
        'Incarnation': '圣徒化',
        'The Dragon\'s Gaze': '龙眼之邪',
        'The Dragon\'s Eye': '龙眼之光',
        'Wrath of the Heavens': '至天之阵：风枪',
        'Chain Lightning': '雷光链',
        'Twisting Dive': '旋风冲',
        'Skyward Leap': '穿天',
        'Spiral Pierce': '螺旋枪',
        'Ascalon\'s Mercy Revealed': '天启・阿斯卡隆之仁',
        'Liquid Heaven': '苍天火液',
        'Altar Flare': '圣坛核爆',
        'Cauterize': '低温俯冲',
        'Death of the Heavens': '至天之阵：死刻',
        'Deathstorm': '死亡风暴',
        'Spear of the Fury': '战女神之枪',
        'Lightning Storm': '百雷',
        'Great Wyrmsbreath': '圣龙吐息',
        'Dread Wyrmsbreath': '邪龙吐息',
        'Swirling Blizzard': '霜息之环',
        'Ice Breath': '寒冰吐息',
        'Holy Breath': '神圣吐息',
        'Flame Breath': '火焰吐息',
        'Staggering Breath': '交错吐息',
        'Mortal Vow': '灭杀的誓言',
        'Akh Afah': '无尽轮回',
        'Hallowed Wings': '神圣之翼',
        'Hallowed Plume': '神圣之羽',
        'Cauterize': '低温俯冲',
        'Mortal Vow': '灭杀的誓言',
        'Wroth Flames': '邪念之火',
        'Akh Morn': '死亡轮回',
        'Cauterize': '低温俯冲',
        'Hot Tail/Hot Wing': '燃烧之翼',
        'Spreading Flames': '复仇之火',
        'Entangled Flames': '同行之火',
        'Holy Orb': '神圣球',
        'Dark Orb': '暗天球',
        'Touchdown': '空降',
        'Revenge of the Horde ': '绝命怒嚎',
        'Shockwave': '冲击波',
        'Alternate End': '_结局分支?',
        'Exaflare\'s Edge': '百京核爆斩',
        'Ice of Ascalon/Flames of Ascalon': '阿斯卡隆之冰/阿斯卡隆之炎',
        'Trinity': '三位一体',
        'Akh Morn\'s Edge ': '死亡轮回',
        'Gigaflare\'s Edge': '十亿核爆',
        'Gigaflare\'s Edge': '十亿核爆',
        'Morn Afah\'s Edge': '无尽顿悟',
      },
    },
  ],
});