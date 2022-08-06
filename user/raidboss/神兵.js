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
const sendMark=(id,makeType)=>{
  callOverlayHandler({ call: 'PostNamazu', c: 'mark', p:'{"ActorID":0x'+id+',"MarkType":'+makeType+'}'});
}
Options.Triggers.push({
    //副本区域
    zoneId: ZoneId.TheWeaponsRefrainUltimate,
    //触发器
    triggers: [
      {
        id: 'UWU Titan Gaols',
        type: 'Ability',
        netRegex: NetRegexes.ability({ id: ['2B6C', '2B6B']}),
        preRun: (data, matches) => {
          data.titanGaols ??= [];
          let job=nametocnjob(matches.target,data);
          data.titanGaols.push(job);
          if (data.titanGaols.length === 3)
            data.titanGaols.sort((a,b)=>{
             return shunxu.find((c)=>c.job==a).order-shunxu.find((c)=>c.job==b).order
            });
        },
        alertText: (data, _matches, output) => {
          if (data.titanGaols?.length !== 3)
            return;
            //console.log(data.party);
            data.meJob=nametocnjob(data.me,data);
            console.log(data.party);
          const idx = data.titanGaols.indexOf(data.meJob);
          if (data.partyJob===undefined)  data.partyJob=[];

          for (let i = 0; i < 8; i++) {
            let job=nametocnjob(data.party.idToName_[data.party.partyIds_[i]],data);
            data.partyJob[i]={
              'ID':data.party.partyIds_[i],
              'job':job
            };
          };
          let 标记=data.titanGaols.map((i)=>data.partyJob.find((j)=>j.job==i));
          sendMark(标记[0],1);sendMark(标记[1],2);sendMark(标记[2],3);
          // callOverlayHandler({ call: 'PostNamazu', c: 'mark', p:'{"ActorID":0x'+标记[0].ID+',"MarkType":'+1+'}'});
          // callOverlayHandler({ call: 'PostNamazu', c: 'mark', p:'{"ActorID":0x'+标记[1].ID+',"MarkType":'+2+'}'});
          // callOverlayHandler({ call: 'PostNamazu', c: 'mark', p:'{"ActorID":0x'+标记[2].ID+',"MarkType":'+3+'}'});
          console.log(标记);
          if (idx < 0)
            return output.text({
              player1: data.ShortName(data.titanGaols[0]),
              player2: data.ShortName(data.titanGaols[1]),
              player3: data.ShortName(data.titanGaols[2]),
            });
          // Just return your number.
          return output.num({ num: idx + 1 });
        },
        // infoText: (data, _matches, output) => {
        //   if (data.titanGaols?.length !== 3)
        //     return;
        //   return output.text({
        //     player1: data.ShortName(data.titanGaols[0]),
        //     player2: data.ShortName(data.titanGaols[1]),
        //     player3: data.ShortName(data.titanGaols[2]),
        //   });
        // },
        outputStrings: {
          num: {
            en: '${num}',
            de: '${num}',
            fr: '${num}',
            ja: '${num}',
            cn: '${num}',
            ko: '${num}',
          },
          text: {
            en: '${player1}, ${player2}, ${player3}',
            de: '${player1}, ${player2}, ${player3}',
            fr: '${player1}, ${player2}, ${player3}',
            ja: '${player1}, ${player2}, ${player3}',
            cn: '${player1}, ${player2}, ${player3}',
            ko: '${player1}, ${player2}, ${player3}',
          },
        },
      },
    ],});