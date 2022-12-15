


// 姓名 => 中文职业简称
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




Options.Triggers.push({
    zoneId: ZoneId.MatchAll,
    triggers: [
        {
            id: '直线',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '757A' }),
            suppressSeconds: 1,
            alertText: (data, matches, output) => {
                return '直线'
            }
          },
          {
            id: '钢铁',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['757B','7575'] }),
            suppressSeconds: 1,
            alertText: (data, matches, output) => {
                return '钢铁'
            }
          },
          {
            id: '月环',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing ({id:['7574','757F']}),
            alertText: (data, matches, output) => {
                return '月环'
            }
          },
          {
            id: 'BarbaricciaEx Impact',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '75A0', source: 'Barbariccia' }),
            // Could also have used 75A1, full cast time is 5.9s
            delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
            response: Responses.knockback(),
          },
          {
            id: '扇形',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing ({id:'757D'}),
            alertText: (data, matches, output) => {
                return '靠近顺劈'
            }
          },
          {
            id: '生命计算点名',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['75A8','7413'] }),
            alertText: (data, matches, output) => {
                if (data.dianMing === undefined) data.dianMing = [];
                data.dianMing.push(matches.target);
                if (matches.target==data.me) {
                    if (matches.id=='75AB') {
                        return '生命计算法点名' 
                    }
                   if (matches.id=='7413') {
                       return '黄泉点名'
                   }
                }
                if (data.dianMing.length>=6&&!data.dianMing.includes(data.me)) {
                 return '无点名'   
                }
            }
          },
          {
            id: '生命计算点名删除',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['75A8','7413'] }),
            delaySeconds:10,
            run: (data, matches, output) => {
                delete data.dianMing;
            }
          },
    ],
    
});
