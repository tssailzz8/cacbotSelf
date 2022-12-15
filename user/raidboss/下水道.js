


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

const sendMessageToParty = (send) => {

    callOverlayHandler({ call: 'PostNamazu', c: 'command', p: '/e ' + send + ' <se.2>' });
}


Options.Triggers.push({
    zoneId: 1075,
    initData: () => ({
        绳次数: 0,
        冲锋次数: 0,
        p1死刑次数:0,
    }),
    triggers: [
        // {
        //     id: '直线12344',
        //     type: 'StartsUsing',
        //     netRegex: NetRegexes.startsUsing(),
        //     run: (data, matches, output) => {

        //         if (parseInt(matches.sourceId, 16)>1073741824) {
        //             sendMessageToParty(matches.id);
        //         }

        //     }
        //   },
        {
            id: 'P1击退',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '776C' }),
            alertText: (data, matches, output) => {
                return '击退'
            }
        },
        {
            id: 'P1微风',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['7755', '7756'] }),
            alertText: (data, matches, output) => {
                if (matches.id == '7755') {
                    data.safe = '左';
                    return '去左下角'
                }
                if (matches.id == '7756') {
                    data.safe = '右';
                    return '去右下角'
                }
            }
        },
        //7757变绿
        //7757变白
        {
            id: 'P1boss变色',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['7758', '7757','7759'] }),
            run: (data, matches, output) => {
                if (matches.id == '7757') data.boss = '绿';
                if (matches.id == '7758') data.boss = '白';
                if (matches.id == '7759') data.boss = '黄';

            }
        },
        {
            id: 'P1boss变色清除',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['7758', '7757'] }),
            delaySeconds: 20,
            run: (data, matches, output) => {
                delete data.boss;

            }
        },
        {
            id: 'P1boss炸弹去对角',
            type: 'Ability',
            netRegex: NetRegexes.ability({ id: '775E' }),
            alertText: (data, matches, output) => {
                if (data.boss == '绿') return '去boss脚下'
                else if (data.boss == '黄') return '去boss十字散开'
                else return '去斜角'
            }
        },
        {
            id: 'P1死刑',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '774F' }),
            alertText: (data, matches, output) => {
                (data.role === "tank")
                {
                    data.p1死刑次数++;
                    if (data.p1==1)  return '死刑去绿球'
                    if (data.p1==2)  return '死刑去扫把多的一侧'
                }
               
               
            }
        },
        {
            id: 'P1AOE',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '7750' }),
            alertText: (data, matches, output) => {
                return '流血AOE'
            }
        },
        //CEA 白（蓝） CEB黄球 CE9绿球
        {
            id: 'P1球处理',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: ['CEA', 'CEB', 'CE9'], capture: true }),
            condition: (data, matches) => Boolean(data.boss),
            infoText: (data, matches, output) => {
                let id = parseInt(matches.targetId, 16)
                if (data.yellow === undefined) data.yellow = [];
                if (data.white === undefined) data.white = [];
                if (matches.effectId == 'CEA') data.white.push(id);
                if (matches.effectId == 'CEB') data.yellow.push(id);
            }
        },
        {
            id: 'P1球连线',
            type: 'Tether',
            netRegex: NetRegexes.tether({ id: '00D8' }),
            durdurationSeconds: 15,
            condition: Conditions.targetIsYou(),
            promise: async (data, matches) => {
                const boss = await callOverlayHandler({
                    call: 'getCombatants',
                    ids: [parseInt(matches.sourceId, 16)],
                });
                data.orb = boss.combatants[0];

            },
            alertText: (data, matches, output) => {
                data.绳次数++;
                if (data.绳次数 == 1) {
                    let 方位 = Math.round(4 - 4 * Math.atan2(data.orb.PosX + 335, data.orb.PosY + 155) / Math.PI) % 8;
                    //正点
                    if (方位 % 2 == 0) {
                        if (data.boss == '绿') {
                            if (data.yellow.includes(data.orb.ID)) return '像外拉(安全点中)'
                            if (data.white.includes(data.orb.ID)) return '顺时针向外侧拉(左)(安全点中)'

                        }
                        if (data.boss == '白') {
                            if (data.white.includes(data.orb.ID)) return '顺时针向外侧拉(左)(安全点boss四角)'
                            if (data.yellow.includes(data.orb.ID)) return '像外侧拉(安全点boss四角)'

                        }
                    }
                    else {
                        if (data.boss == '绿') {
                            if (data.yellow.includes(data.orb.ID)) return '延boss像外拉(安全点中)'
                            if (data.white.includes(data.orb.ID)) return '顺时针向外侧拉(左)(安全点中)'

                        }
                        if (data.boss == '白') {
                            if (data.yellow.includes(data.orb.ID)) return '像外侧拉(安全点boss四角)'
                            if (data.white.includes(data.orb.ID)) return '顺时针向外侧拉(左)(安全点boss四角)'

                        }
                    }
                }
                if (data.绳次数 == 2) {
                    let other = data.safe == '左' ? '右' : '左'
                    if (data.boss == '绿') {
                        return '向' + data.safe + '引导'
                    }
                    if (data.boss == '白') {
                        return '向' + other + '引导'
                    }
                }
            }
        },
        {
            id: 'P2AOE',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '7671' }),
            alertText: (data, matches, output) => {
                return 'AOE'
            }
        },
        {
            id: 'P2分摊',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '766C' }),
            alertText: (data, matches, output) => {
                return '分摊'
            }
        },
        {
            id: 'P2踩塔',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: 'CDB', capture: true }),
            condition: Conditions.targetIsYou(),
            durdurationSeconds: 5,
            delaySeconds: 12,
            infoText: (data, matches, output) => {
                if (parseFloat(matches.duration) <= 19) return '先放圈后踩塔'
                if (parseFloat(matches.duration) > 19) return '先踩塔后放圈'
            }
        },
        {
            id: 'P2踩塔播报',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: 'CDB', capture: true }),
            condition: Conditions.targetIsYou(),
            durdurationSeconds: 5,
            delaySeconds: 19,
            infoText: (data, matches, output) => {
                if (parseFloat(matches.duration) <= 19) return '踩塔'
                if (parseFloat(matches.duration) > 19) return '放圈'
            }
        },
        {
            id: 'P2地震',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '768C' }),
            condition: Conditions.targetIsYou(),
            alertText: (data, matches, output) => {
                return '点名，远离队友'
            }
        },
        //cda单点
        //cdc单点拉屎
        {
            id: 'P2分摊点名',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: ['CDA', 'CDC'], capture: true }),
            alertText: (data, matches, output) => {
                let 分摊时间;
                if (matches.effectId == 'CDA' && matches.target == data.me) {
                    分摊时间 = parseFloat(matches.duration);
                }
                if (matches.target == data.me) {
                    if (分摊时间 >= 16 && matches.effectId == 'CDA') return '先分摊后分散'
                    if (分摊时间 <= 14 && matches.effectId == 'CDA') return '先分散后分摊'
                    if (matches.effectId == 'CDC') return '诱导地火'
                }


            }
        },
        {
            id: 'P2冲锋boss收集',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['7658', '7659','765A'] }),
            // promise: async (data, matches) => {
            //     if (data.场外冲锋bossID === undefined) data.场外冲锋bossID = [];
            //     data.场外冲锋bossID.push(parseInt(matches.sourceId, 16));
            //     if (data.场外冲锋bossID.length>=2) {
            //         let boss = await callOverlayHandler({
            //             call: 'getCombatants',
            //         });
            //         let bossData2 = boss.combatants.filter((boss) =>data.场外冲锋bossID.includes(boss.ID));
            //         if (data.场外冲锋boss === undefined) data.场外冲锋boss = [];
            //         data.场外冲锋boss[0]=bossData2[0];
            //         data.场外冲锋boss[1]=bossData2[1];
            //         data.冲锋次数++;
            //     }

            // },
            run: (data, matches) => {
                if (data.场外冲锋boss === undefined) data.场外冲锋boss = [];
                data.场外冲锋boss.push({'x':matches.x,'y':matches.y});
            }
        },
        {
            id: 'P2冲锋boss删除',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '7658' }),
            delaySeconds:5,
            run: (data, matches) => {
               delete data.场外冲锋bossID;
               delete  data.场外冲锋boss;
               delete data.中间boss;
            }
        },
        {
            id: 'P2冲锋',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '765C' }),
            delaySeconds: 1,
            // promise:
            //     async (data, matches) => {
                    
            //         const boss = await callOverlayHandler({
            //             call: 'getCombatants',
            //             ids: [parseInt(matches.sourceId, 16)],
            //         });
            //         if (data.中间boss === undefined) data.中间boss = [];
            //         data.中间boss.push(boss.combatants[0]);
            //     },

            alertText: (data, matches, output) => {
                if (data.中间boss === undefined) data.中间boss = [];
                data.中间boss.push({'x':matches.x,'y':matches.y});
                if (data.场外冲锋boss === undefined) data.场外冲锋boss = [];
                if (data.中间boss.length >= 2 && data.场外冲锋boss.length >= 2) {
                    data.冲锋次数++;
                    let distanceArry = [];
                    data.场外冲锋boss.forEach(i => {
                        data.中间boss.forEach(j => {
                            let 方位 =Math.round(  Math.atan2(i.x - j.x, i.y - j.y) / Math.PI*180);
                            let distance = Math.hypot(i.x - j.x, i.y - j.y);
                            console.log(distance+":"+方位);
    
                            if ((方位+180) % 45==0) {
     
                                if (distance <= 20 && distance > 15) distanceArry.push({ 'distance': 1, 'pos': 方位 });
                                if (distance > 20 && distance <= 28) distanceArry.push({ 'distance': 2, 'pos': 方位 });
                                if (distance > 28) distanceArry.push({ 'distance': 3, 'pos': 方位 });
                            }
                        });
                        
                        
                    });

                    distanceArry.sort((a, b) => {
                        return a.distance - b.distance
                    });
                   
                    if (data.冲锋次数 ) {
        
                        if (distanceArry[1].distance == 2) {
                            //左上冲右下
                            if (distanceArry[1].pos == 45 || distanceArry[1].pos == -135) return '站在中间右边穿'
                            if (distanceArry[1].pos == -45 || distanceArry[1].pos == 135) return '站在中间左边穿'
                        }
                        if (distanceArry[1].distance == 3) {
                            if (distanceArry[1].pos == 45 || distanceArry[1].pos == -135) 
                            {
                                if (distanceArry[0].distance==1) return '站在右下内侧'
                                if (distanceArry[0].distance==2) return '站在右下外侧'
                            }
                            if (distanceArry[1].pos == -45 || distanceArry[1].pos == 135) 
                            {
                                if (distanceArry[0].distance==1) return '站在左下内侧'
                                if (distanceArry[0].distance==2) return '站在左下外侧'
                            }
                        }
                    }
                    if (data.冲锋次数 == 2||data.冲锋次数 == 4) {
                        if (distanceArry[1].distance == 2) {

                            if (distanceArry[1].pos == 45 || distanceArry[1].pos == -135) return '站在中间左边穿'
                            if (distanceArry[1].pos == -45 || distanceArry[1].pos == 135) return '站在中间右边穿'
                        }
                        if (distanceArry[1].distance == 3) {
                            if (distanceArry[1].pos == 45 || distanceArry[1].pos == -135) 
                            {
                                if (distanceArry[0].distance==1) return '站在左下内侧'
                                if (distanceArry[0].distance==2) return '站在左下外侧'
                            }
                            if (distanceArry[1].pos == -45 || distanceArry[1].pos == 135) 
                            {
                                if (distanceArry[0].distance==1) return '站在右下内侧'
                                if (distanceArry[0].distance==2) return '站在右下外侧'
                            }
                        }
                    }

                }


            }
        },
        {
            id: 'P2冲锋删除',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['7658', '765A'] }),
            delaySeconds: 5,
            run: (data, matches) => {
                delete data.中间boss; delete data.场外冲锋boss
            },
        },
        {
            id: 'P2分摊点名播报',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: ['CDA', 'CDC'], capture: true }),
            delaySeconds: 17,
            alertText: (data, matches, output) => {
                let 分摊时间;
                if (matches.effectId == 'CDA' && matches.target == data.me) {
                    分摊时间 = parseFloat(matches.duration);
                }
                if (matches.target == data.me) {
                    if (分摊时间 >= 16 && matches.effectId == 'CDA') return '分散'
                    if (分摊时间 <= 14 && matches.effectId == 'CDA') return '分摊'

                }


            }
        },
        {
            id: 'P2钢铁',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['765D', '765E', '765F'] }),
            alertText: (data, matches, output) => {
                if (matches.id == '765D') return '二环待机'
                if (matches.id == '765E') return '三环待机'
                if (matches.id == '765F') return '圈外待机'
            }
        },
        {
            id: 'P2钢铁播报',
            type: 'StartsUsing',
            netRegex: NetRegexes.ability({ id: ['765D', '765E', '765F'] }),
            alertText: (data, matches, output) => {
                return '穿穿穿'
            }
        },
        {
            id: 'P2金银buff',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: ['CDF', 'CE0'], capture: true }),
            condition: Conditions.targetIsYou(),
            alertText: (data, matches, output) => {
                if (matches.effectId == 'CE0' && parseInt(matches.count, 16) == 2) return '找金色重叠'
                if (matches.effectId == 'CDF' && parseInt(matches.count, 16) == 2) return '找白色重叠'
                if (matches.effectId == 'CDF' && parseInt(matches.count, 16) == 1) return '找金银重叠'
            }
        },
        {
            id: 'P2九连环',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '7666' }),
            alertText: (data, matches, output) => {
                return '拉线九连环，中央集合'
            }
        },
        {
            id: 'P2死刑',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '7672' }),
            alertText: (data, matches, output) => {
                if (data.role=='tank') {
                    return '死刑'
                }
                
            }
        },
        {
            id: 'P3AOE',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '74AF' }),
            alertText: (data, matches, output) => {
                return 'AOE'
            }
        },
        {
            id: 'P3死刑',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '74AD' }),
            alertText: (data, matches, output) => {
                if (data.role=='tank')  return '死刑'
                else return '远离坦克'
               
            }
        },
        {
            id: 'P3挡刀buff',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: 'B7D', capture: true }),
            condition: Conditions.targetIsYou(),
            run: (data, matches) => {
                if (data.Vulnerable === undefined) data.Vulnerabl = [];
                data.Vulnerabl.push(matches.target);
            }
        },
        {
            id: 'P3挡刀',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '74B3' }),
            alertText: (data, matches, output) => {
                if (data.Vulnerabl.includes(data.me)) return '去背后躲避'
                else return '在前挡刀';
            }
        },
        {
            id: 'P3三运buff',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: 'B9A', capture: true }),
            condition: Conditions.targetIsYou(),
            alertText: (data, matches, output) => {
                if (parseInt(matches.count, 16) == 0x1cd) return '下方，踩内侧传送'
                if (parseInt(matches.count, 16) == 0x1d3) return '下方，踩外侧传送'
                if (parseInt(matches.count, 16) == 0x1CE) return '上方，踩外侧传送'
                if (parseInt(matches.count, 16) == 0x1D2) return '上方，踩内侧传送'
            }
        },
        {
            id: 'P3墙线播报',
            type: 'AddedCombatant',
            netRegex: NetRegexes.addedCombatantFull({ npcNameId: '11397' }),
            suppressSeconds: 60,
            alertText: (data, matches, output) => {
                if (+matches.y < -120) { data.line = '红'; return '先碰红线' }
                else return '先碰蓝线'
            }
        },
        {
            id: 'P3线顺序播报',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: ['CC4', 'CC5', 'CC6', 'CC7'], capture: true }),
            condition: Conditions.targetIsYou(),
            alertText: (data, matches, output) => {
                let bobao = data.line == '红' ? '红' : '蓝'
                data.mebuff = matches.effectId;
                if (matches.effectId == 'CC4') return '先撞' + bobao + '1'
                if (matches.effectId == 'CC5') return '先撞' + bobao + '2'
                if (matches.effectId == 'CC6') return '先撞' + bobao + '3'
                if (matches.effectId == 'CC7') return '先撞' + bobao + '4'

            }
        },
        {
            id: 'P3线第顺序删除',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: ['CC4', 'CC5', 'CC6', 'CC7'], capture: true }),
            condition: Conditions.targetIsYou(),
            delaySeconds: 16,
            run: (data, matches, output) => {
                delete data.mebuff;

            }
        },
        {
            id: 'P3线第二次顺序播报',
            type: 'GainsEffect',
            netRegex: NetRegexes.gainsEffect({ effectId: 'B7D', capture: true }),
            condition: Conditions.targetIsYou(),
            alertText: (data, matches, output) => {
                let bobao = data.line == '红' ? '蓝' : '红'
                if (data.mebuff == 'CC4') return '准备撞' + bobao + '1'
                if (data.mebuff == 'CC5') return '准备撞' + bobao + '2'
                if (data.mebuff == 'CC6') return '准备撞' + bobao + '3'
                if (data.mebuff == 'CC7') return '准备撞' + bobao + '4'

            }
        },
    ],

});
