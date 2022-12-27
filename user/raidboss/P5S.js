

//自动获取标点，需要安装cactbotself.dll，如果不要自动获取，那就别启动cactbotself
var camera;
addOverlayListener("onPlayerControl", (e) => {
    camera = e.detail;
});


function fangxiang(x, y) {
    //返回所在的方向位置
    if (isNaN(x)) {
        x = parseFloat(x);
        y = parseFloat(y);
    };
    if (x < 100 && y < 100) {
        return '左上';
    };
    if (x < 100 && y > 100) {
        return '左下';
    };
    if (x > 100 && y < 100) {
        return '右上';
    };
    if (x > 100 && y > 100) {
        return '右下';
    };
};

const convertCoordinatesToDirection = (x, y) => {
    if (x > 100)
        return y < 100 ? 'NE' : 'SE';
    return y < 100 ? 'NW' : 'SW';
};
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


function 获取坐标(data)
{
    if (camera) {
        let one = camera.ONE;
        let two = camera.TWO;
        let three = camera.THREE;
        let four = camera.FOUR;
        if (one.Active && two.Active && three.Active && four.Active) {
            let _one = fangxiang(one.X, one.Z)
            let _two = fangxiang(two.X, two.Z)
            let _three = fangxiang(three.X, three.Z)
            let _four = fangxiang(four.X, four.Z)
            if (_one == '左上')
                data.左上 = '1';
            if (_two == '左上')
                data.左上 = '2';
            if (_three == '左上')
                data.左上 = '3';
            if (_four == '左上')
                data.左上 = '4';
            if (_one == '右上')
                data.右上 = '1';
            if (_two == '右上')
                data.右上 = '2';
            if (_three == '右上')
                data.右上 = '3';
            if (_four == '右上')
                data.右上 = '4';
            if (_one == '右下')
                data.右下 = '1';
            if (_two == '右下')
                data.右下 = '2';
            if (_three == '右下')
                data.右下 = '3';
            if (_four == '右下')
                data.右下 = '4';
            if (_one == '左下')
                data.左下 = '1';
            if (_two == '左下')
                data.左下 = '2';
            if (_three == '左下')
                data.左下 = '3';
            if (_four == '左下')
                data.左下 = '4';

        };
    };
}

Options.Triggers.push({
    zoneId: 1082,
    overrideTimelineFile: true,
    timelineFile: "P5S.txt",
    initData: () => {
        return {
            topazClusterCombatantIdToAbilityId: {},

            phase: 0,
            四连安全点num: 0,
            四连石头: [],
            四连安全点: [],
        };
    },
    timelineTriggers: [
        {
            id: '踩塔',
            regex: /踩塔/,
            beforeSeconds: 5,
            alertText: '踩塔',
        },
        {
            id: '八连跳跃',
            regex: /八连跳跃 1/,
            beforeSeconds: 16,
            alertText: '准备八连跳跃',
        },
        {
            id: '播报分散',
            regex: /播报分散/,
            alertText: '分散分散',
        },
        {
            id: '播报集合放黄圈',
            regex: /播报集合放黄圈/,
            alertText: '集合放黄圈',
        },
        {
            id: '播报分摊',
            regex: /播报分摊/,
            alertText: '分摊分摊',
        },
        {
            id: '自动获取坐标',
            regex: /自动获取坐标/,
            run: (data, matches) => {
                if (camera) {
                    let one = camera.ONE;
                    let two = camera.TWO;
                    let three = camera.THREE;
                    let four = camera.FOUR;
                    if (one.Active && two.Active && three.Active && four.Active) {
                        let _one = fangxiang(one.X, one.Z)
                        let _two = fangxiang(two.X, two.Z)
                        let _three = fangxiang(three.X, three.Z)
                        let _four = fangxiang(four.X, four.Z)
                        if (_one == '左上')
                            data.左上 = '1';
                        if (_two == '左上')
                            data.左上 = '2';
                        if (_three == '左上')
                            data.左上 = '3';
                        if (_four == '左上')
                            data.左上 = '4';
                        if (_one == '右上')
                            data.右上 = '1';
                        if (_two == '右上')
                            data.右上 = '2';
                        if (_three == '右上')
                            data.右上 = '3';
                        if (_four == '右上')
                            data.右上 = '4';
                        if (_one == '右下')
                            data.右下 = '1';
                        if (_two == '右下')
                            data.右下 = '2';
                        if (_three == '右下')
                            data.右下 = '3';
                        if (_four == '右下')
                            data.右下 = '4';
                        if (_one == '左下')
                            data.左下 = '1';
                        if (_two == '左下')
                            data.左下 = '2';
                        if (_three == '左下')
                            data.左下 = '3';
                        if (_four == '左下')
                            data.左下 = '4';
                        左上 = data.左上; 右上 = data.右上; 右下 = data.右下; 左下 = data.左下;
                    };
                };
            },
        },
    ],
    triggers: [
        {
            id: 'P5S Sonic Howl',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '7720' }),
            suppressSeconds: 1,
            alertText: (data, matches, output) => {
                return 'AOE'
            }
        },
        {
            id: 'P5S Ruby Glow',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: ['76F3', '76F4'] }),
            suppressSeconds: 1,
            alertText: (data, matches, output) => {
                data.phase++;
                return '场地变化AOE'
            }
        },
        {
            id: 'P5S Raging Tail Move',
            disabled: true,
            type: 'Ability',
            netRegex: NetRegexes.ability({ id: '7A0C' }),
        },
        {
            id: 'P5S Venom Pool with Crystals',
            disabled: true,
            // TODO: Callout safe quadrant/half
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '79E2' }),

        },
        {
            id: '毒圈安全点',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '76FE' }),
            condition: (data, matches) => data.phase == 1,
            promise: async (data, matches) => {
                const boss = await callOverlayHandler({
                    call: 'getCombatants',
                    ids: [parseInt(matches.sourceId, 16)],
                });
                let bossData = boss.combatants[0];
                let 方位 = Math.round(Math.round(4 - 4 * Math.atan2(bossData.PosX - 100, bossData.PosY - 100) / Math.PI) % 8);
                if (data.safe === undefined) data.safe = [0, 1, 2, 3, 4, 5, 6, 7];
                if (方位 % 2 !== 0) {
                    let distance = Math.hypot(bossData.PosX - 100, bossData.PosY - 100);
                    if (distance > 8) delete data.safe[方位];
                }
                if (方位 == 0) {
                    if (bossData.PosX > 100) delete data.safe[1];
                    if (bossData.PosX < 100) delete data.safe[7];

                }
                if (方位 == 4) {
                    if (bossData.PosX > 100) delete data.safe[3];
                    if (bossData.PosX < 100) delete data.safe[5];

                }
                if (方位 == 2) {
                    if (bossData.PosY > 100) delete data.safe[3];
                    if (bossData.PosY < 100) delete data.safe[1];
                }
                if (方位 == 6) {
                    if (bossData.PosY > 100) delete data.safe[5];
                    if (bossData.PosY < 100) delete data.safe[7];
                }
            },
            alertText: (data, matches, output) => {
                let abcd = data.safe.filter(i => i !== undefined)
                if (abcd.length <= 5) {
                    const tempAbcd = Array.from(abcd);
                    data.safe.push(10);
                    if (tempAbcd.includes(1)) { return '右上安全' }
                    if (tempAbcd.includes(3)) { return '右下安全' }
                    if (tempAbcd.includes(5)) { return '左下安全' }
                    if (tempAbcd.includes(7)) { return '左上安全' }
                }
            }
        },
        {
            id: '收集黄水晶',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '79FE' }),
            condition: (data, matches) => data.phase == 2 && matches.castTime > 10,
            promise: async (data, matches) => {
                const boss = await callOverlayHandler({
                    call: 'getCombatants',
                    ids: [parseInt(matches.sourceId, 16)],
                });
                data.黄水晶 = boss.combatants[0];
            },
            alertText: (data, matches, output) => {
                let 方位1 = Math.round(Math.round(4 - 4 * Math.atan2(data.水晶[0].PosX - 100, data.水晶[0].PosY - 100) / Math.PI) % 8);
                let 方位2 = Math.round(Math.round(4 - 4 * Math.atan2(data.黄水晶.PosX - 100, data.黄水晶.PosY - 100) / Math.PI) % 8);
                if (方位1 !== 方位2) data.绿水晶 = data.水晶[0];
                if (方位1 == 方位2) data.绿水晶 = data.水晶[1];
                if (data.safe === undefined) data.safe = [0, 1, 2, 3, 4, 5, 6, 7];
                if (data.黄水晶 && data.绿水晶) {
                    let 绿水晶方位 = Math.round(Math.round(2 - 2 * Math.atan2(data.绿水晶.PosX - 100, data.绿水晶.PosY - 100) / Math.PI) % 4);
                    let 黄水晶方位 = Math.round(Math.round(2 - 2 * Math.atan2(data.绿水晶.PosX - 100, data.绿水晶.PosY - 100) / Math.PI) % 4);
                    if (data.绿水晶.PosY > 100) {
                        delete data.safe[2]; delete data.safe[3]; delete data.safe[4]; delete data.safe[5];
                    }
                    if (data.绿水晶.PosY <= 100) {
                        delete data.safe[0]; delete data.safe[7]; delete data.safe[6]; delete data.safe[1];
                    }
                    if (data.黄水晶.PosX > data.黄水晶.PosY) {
                        delete data.safe[0]; delete data.safe[1]; delete data.safe[2]; delete data.safe[3];
                    }
                    else {
                        delete data.safe[7]; delete data.safe[6]; delete data.safe[5]; delete data.safe[4];
                    }
                    if (data.safe.includes(1)) return '左上安全'
                    if (data.safe.includes(3)) return '右下安全'
                    if (data.safe.includes(5)) return '右下安全'
                    if (data.safe.includes(7)) return '左上安全'
                };
            }
        },

        {
            id: '毒圈第二次计算安全点',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '76FE' }),
            condition: (data, matches) => data.phase == 2,
            promise: async (data, matches) => {
                const boss = await callOverlayHandler({
                    call: 'getCombatants',
                    ids: [parseInt(matches.sourceId, 16)],
                });
                let bossData = boss.combatants[0];
                if (data.水晶 === undefined) data.水晶 = [];
                data.水晶.push(bossData);
            },

        },
        {
            id: '毒圈安全点删除',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '76FE' }),
            delaySeconds: 10,
            run: (data, matches) => {
                delete data.safe;
            },
        },
        {
            id: 'P5S Venomous Mass',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '771D' }),
            alarmText: (data, _matches, output) => {
                if (data.role === 'tank' && data.target !== data.me)
                    return output.tankSwap();
            },
            alertText: (data, _matches, output) => {
                if (data.role === 'tank' && data.target !== data.me)
                    return;
                if (data.target === data.me)
                    return output.busterOnYou();
                return output.busterOnTarget({ player: nametocnjob(data.target, data) });
            },
            outputStrings: {
                busterOnYou: Outputs.tankBusterOnYou,
                busterOnTarget: Outputs.tankBusterOnPlayer,
                tankSwap: Outputs.tankSwap,
            },
        },
        {
            id: '死刑全体播报',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '771D' }),
            alertText: (data) => {
                if (!data.party.isTank(data.me))
                    return '坦克死刑';
            },
        },
        {
            id: 'P5S Toxic Crunch',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '784A' }),
            infoText: (data, _matches, output) => {
                if (data.role === 'tank' && data.target !== data.me)
                    return;
                if (data.target === data.me)
                    return output.busterOnYou();
                return output.tankBuster();
            },
            outputStrings: {
                busterOnYou: Outputs.tankBusterOnYou,
                tankBuster: Outputs.tankBuster,
            },
        },
        {
            id: 'P5S Double Rush',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '771B' }),
            delaySeconds: (data, matches) => parseFloat(matches.castTime) / 2,
            alertText: (data, matches, output) => {
                return '防击退';
            }
        },
        {
            id: '双重冲撞',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '771B' }),
            alertText: '冲锋，去背后',
        },
        {
            id: 'P5S Ruby 3 Topaz Cluster Collect',
            type: 'StartsUsing',
            netRegex: { id: '770[3456]' },
            run: (data, matches) =>
                data.topazClusterCombatantIdToAbilityId[parseInt(matches.sourceId, 16)] = matches.id,
        },
        // {
        //     id: 'P5S Ruby 3 Topaz Cluster',
        //     type: 'Ability',
        //     netRegex: { id: '7702'},
        //     durationSeconds: 12,
        //     promise: async (data) => {
        //       const result = await callOverlayHandler({
        //         call: 'getCombatants',
        //         ids: Object.keys(data.topazClusterCombatantIdToAbilityId).map(Number),
        //       });
        //       // For each topaz stone combatant, determine the quadrant
        //       for (const combatant of result.combatants) {
        //         if (combatant.ID === undefined)
        //           continue;
        //         const abilityId = data.topazClusterCombatantIdToAbilityId[combatant.ID];
        //         if (abilityId === undefined)
        //           continue;
        //         // Convert from ability id to [0-3] index
        //         // 7703 is the Topaz Ray cast with the lowest cast time
        //         const index = parseInt(abilityId, 16) - parseInt('7703', 16);
        //         data.topazRays[index] ??= [];
        //         // Map from coordinate position to intercardinal quadrant
        //         const direction = convertCoordinatesToDirection(combatant.PosX, combatant.PosY);
        //         data.topazRays[index]?.push(direction);
        //       }
        //     },
        //     infoText: (data, _matches, output) => {
        //       const remainingDirections = {};
        //       for (const [index, dirs] of Object.entries(data.topazRays)) {
        //         const directions = [data.左上, data.右上, data.右下, data.左下];
        //         remainingDirections[index] = new Set(directions);
        //         for (const dir of dirs)
        //           remainingDirections[index]?.delete(dir);
        //       }
        //       debugger;
        //       // 770[34] cast 2 times, 770[56] cast 3 times
        //       const expectedLengths = [2, 2, 1, 1];
        //       const safeDirs = [];
        //       for (let i = 0; i < 4; i++) {
        //         if (remainingDirections[i]?.size !== expectedLengths[i])
        //           return;
        //         const tmpDirs = [...remainingDirections[i] ?? []];
        //         if (!tmpDirs[0])
        //           return;
        //         // If there's one safe location, print that
        //         let dirStr = tmpDirs[0];
        //         // If there's multiple, prefer south
        //         if (tmpDirs.length === 2 && tmpDirs[1])
        //           dirStr = [data.右上, data.左下].includes(tmpDirs[0]) ? tmpDirs[0] : tmpDirs[1];

        //         safeDirs.push(output[dirStr]());
        //       }
        //       if (safeDirs.length !== 4)
        //         return;
        //       return output.text({
        //         dir1: safeDirs[0],
        //         dir2: safeDirs[1],
        //         dir3: safeDirs[2],
        //         dir4: safeDirs[3],
        //       });
        //     },
        //     outputStrings: {
        //       NE: Outputs.dirNE,
        //       SE: Outputs.dirSE,
        //       SW: Outputs.dirSW,
        //       NW: Outputs.dirNW,
        //       text: {
        //         en: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
        //         de: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
        //         fr: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
        //         ja: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
        //         ko: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
        //       },
        //     },
        //   },
        {
            id: 'P5S Ruby 3 Topaz Cluster',
            type: 'Ability',
            netRegex: { id: '7702'},
            durationSeconds: 12,
            promise: async (data) => {
                // Log position data can be stale, call OverlayPlugin
                const result = await callOverlayHandler({
                    call: 'getCombatants',
                    ids: Object.keys(data.topazClusterCombatantIdToAbilityId).map(Number),
                });
                // For each topaz stone combatant, determine the quadrant
                for (const combatant of result.combatants) {
                    if (combatant.ID === undefined)
                        continue;
                    const abilityId = data.topazClusterCombatantIdToAbilityId[combatant.ID];
                    if (abilityId === undefined)
                        continue;
                    // Convert from ability id to [0-3] index
                    // 7703 is the Topaz Ray cast with the lowest cast time
                    const index = parseInt(abilityId, 16) - parseInt('7703', 16);
                    data.topazRays[index] ??= [];
                    // Map from coordinate position to intercardinal quadrant
                    const direction = convertCoordinatesToDirection(combatant.PosX, combatant.PosY);
                    data.topazRays[index]?.push(direction);
                }
            },
            infoText: (data, _matches, output) => {
                const remainingDirections = {};
                获取坐标(data);
                for (const [index, dirs] of Object.entries(data.topazRays)) {
                    const directions = ['NW', 'NE', 'SE', 'SW'];

                    remainingDirections[index] = new Set(directions);
                    for (const dir of dirs)
                        remainingDirections[index]?.delete(dir);
                }
                // 770[34] cast 2 times, 770[56] cast 3 times
                const expectedLengths = [2, 2, 1, 1];
                const safeDirs = [];
                for (let i = 0; i < 4; i++) {
                    if (remainingDirections[i]?.size !== expectedLengths[i])
                        return;
                    const tmpDirs = [...remainingDirections[i] ?? []];
                    if (!tmpDirs[0])
                        return;
                    // If there's one safe location, print that
                    let dirStr = tmpDirs[0];
                    // If there's multiple, prefer south
                    if (tmpDirs.length === 2 && tmpDirs[1])
                        dirStr = ['SE', 'SW'].includes(tmpDirs[0]) ? tmpDirs[0] : tmpDirs[1];
                    const directions1 = [{ 'NW': data.左上 }, { 'NE': data.右上 }, { 'SE': data.右下 }, { 'SW': data.左下 }];
                    let bobao=directions1.find(direction => direction[dirStr]);
                    let abc=Object.values(bobao)[0]
                    safeDirs.push(abc);
                }
                if (safeDirs.length !== 4)
                    return;
                return `${safeDirs[0]}->${safeDirs[1]}->${safeDirs[2]}->${safeDirs[3]}`
                return output.text({
                    dir1: safeDirs[0],
                    dir2: safeDirs[1],
                    dir3: safeDirs[2],
                    dir4: safeDirs[3],
                });
            },
            outputStrings: {
                NE: Outputs.dirNE,
                SE: Outputs.dirSE,
                SW: Outputs.dirSW,
                NW: Outputs.dirNW,
                text: {
                    en: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
                    de: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
                    fr: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
                    ja: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
                    ko: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
                },
            },
        },
        {
            id: '4连安全点',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '79FF' }),
            preRun: (data, matches) => {
                data.四连安全点num++;
                data.四连石头.push([matches.x, matches.y])
            },
            durationSeconds: (data) => {
                let num = data.四连安全点num;
                if (num == 2 || num == 4 || num == 7)
                    return 2;
                else
                    return 10;
            },
            alertText: (data) => {
                let num = data.四连安全点num;
                let 安全点 = '';
                let a;
                if (num == 2 || num == 4) {
                    a = [fangxiang(data.四连石头[0][0], data.四连石头[0][1]), fangxiang(data.四连石头[1][0], data.四连石头[1][1])]
                    if (!a.includes('左下'))
                        安全点 = data.左下;
                    if (!a.includes('右下'))
                        安全点 = data.右下;
                    data.四连石头 = []
                    data.四连安全点.push(安全点);
                    return 安全点;
                };
                if (num == 7) {
                    a = [fangxiang(data.四连石头[0][0], data.四连石头[0][1]), fangxiang(data.四连石头[1][0], data.四连石头[1][1]), fangxiang(data.四连石头[2][0], data.四连石头[2][1])]
                    if (!a.includes('左下'))
                        安全点 = data.左下;
                    if (!a.includes('右下'))
                        安全点 = data.右下;
                    if (!a.includes('左上'))
                        安全点 = data.左上;
                    if (!a.includes('右上'))
                        安全点 = data.右上;
                    data.四连石头 = []
                    data.四连安全点.push(安全点);
                    return 安全点
                };
                if (num == 10) {
                    if (data.四连安全点[2] == data.左下)
                        安全点 = data.右上;
                    if (data.四连安全点[2] == data.左上)
                        安全点 = data.右下;
                    if (data.四连安全点[2] == data.右上)
                        安全点 = data.左下;
                    if (data.四连安全点[2] == data.右下)
                        安全点 = data.左上;
                    data.四连石头 = []
                    data.四连安全点.push(安全点);
                    return data.四连安全点[0] + ' ' + data.四连安全点[1] + ' ' + data.四连安全点[2] + ' ' + data.四连安全点[3]
                };
            },
        },
        {
            id: 'P5S Venom Squall/Surge',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '771[67]' }),
            durationSeconds: 5,
            alertText: (_data, matches, output) => {
                const spread = '分散';
                const healerGroups = '分摊';
                // Venom Squall
                if (matches.id === '7716')
                    return output.text({ dir1: spread, dir2: healerGroups });
                return output.text({ dir1: healerGroups, dir2: spread });
            },
            outputStrings: {
                healerGroups: '治疗分摊',
                spread: Outputs.spread,
                text: {
                    en: '${dir1} -> 放圈 -> ${dir2}',
                    cn: '${dir1} -> 放圈 -> ${dir2}',
                },
            },
        },
        {
            id: 'P5S Tail to Claw',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '7712' }),
            durationSeconds: 5,
            alertText: '先去头部 -> 去屁股',
        },
        {
            id: 'P5S Claw to Tail',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '770E' }),
            durationSeconds: 5,
            alertText: '先去屁股 -> 去头部',
        },
        {
            id: 'P5S Raging Claw Move',
            disabled: true,
            type: 'Ability',
            netRegex: NetRegexes.ability({ id: '7710' }),
        },
        {
            id: '8连',
            type: 'Ability',
            netRegex: NetRegexes.ability({ id: '7709' }),
            promise: async (data, matches) => {
                const boss = await callOverlayHandler({
                    call: 'getCombatants',
                    ids: [parseInt(matches.sourceId, 16)],
                });
                let bossData = boss.combatants[0];
                if (data.八连 === undefined) data.八连 = [];
                let 方位 = Math.round(4 - 4 * Math.atan2(bossData.x - 100, bossData.y - 100) / Math.PI) % 8;
                data.八连.push(方位);

            },
            alertText: (data, matches, output) => {
                if (data.八连.length >= 7) {
                    let 顺逆 = data.八连[1] - data.八连[0];
                    if (顺逆 > 0 || (顺逆 >= -7 && 顺逆 <= -3)) return '左三右四';
                    else return '左一右三左4'
                }
            }
        },
        {
            id: '射线攻击',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '76F7' }),
            alertText: (data, matches, output) => {
                return '去boss对面'
            }
        },
        {
            id: 'P5S Raging Claw',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '76FA' }),
            alertText: (data, matches, output) => {
                return '去boss背后'
            }
        },
        {
            id: 'P4半场',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '79FE' }),
            condition: (data, matches) => data.phase == 4,
            promise: async (data, matches) => {
                const boss = await callOverlayHandler({
                    call: 'getCombatants',
                    ids: [parseInt(matches.sourceId, 16)],
                });
                let bossData = boss.combatants[0];
                if (data.P4上边 === undefined) data.P4上边 = [];
                if (data.P4下边 === undefined) data.P4下边 = [];
                if (bossData.PosX > bossData.PosY) data.P4上边.push(bossData);
                if (bossData.PosX < bossData.PosY) data.P4下边.push(bossData);

            },
            alertText: (data, matches, output) => {
                if (data.P4上边.length == 2 && data.P4下边.length == 3) return '去上边水晶分摊'
                if (data.P4上边.length == 3 && data.P4下边.length == 2) return '去下边水晶分摊'
            }
        },
        {
            id: 'P5半场',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '79FE' }),
            condition: (data, matches) => data.phase == 5,
            promise: async (data, matches) => {
                const boss = await callOverlayHandler({
                    call: 'getCombatants',
                    ids: [parseInt(matches.sourceId, 16)],
                });
                let bossData = boss.combatants[0];
                if (data.P5黄水晶 === undefined) data.P5黄水晶 = [];
                data.P5黄水晶.push(bossData);

            },
            alertText: (data, matches, output) => {
                if (data.P5黄水晶.length == 2) {
                    let bobao = ['左上', '右上', '右下', '左下'];
                    for (let i = 0; i < 2; i++) {
                        if (data.四连[i].PosX > 100 && data.P5黄水晶[i].PosY < 100) delete bobao[1];
                        if (data.四连[i].PosX > 100 && data.P5黄水晶[i].PosY > 100) delete bobao[2];
                        if (data.四连[i].PosX < 100 && data.P5黄水晶[i].PosY > 100) delete bobao[3];
                        if (data.四连[i].PosX < 100 && data.P5黄水晶[i].PosY < 100) delete bobao[0];
                    }
                    bobao = bobao.filter(s => s && s.trim());
                    return `${bobao[0]}/${bobao[1]}安全`
                }
            }
        },
        {
            id: 'P6半场',
            type: 'StartsUsing',
            netRegex: NetRegexes.startsUsing({ id: '79FE' }),
            condition: (data, matches) => data.phase == 6,
            promise: async (data, matches) => {
                const boss = await callOverlayHandler({
                    call: 'getCombatants',
                    ids: [parseInt(matches.sourceId, 16)],
                });
                let bossData = boss.combatants[0];
                if (data.P5左上 === undefined) data.P5左上 = [];
                if (data.P5右上 === undefined) data.P5右上 = [];
                if (data.P5右下 === undefined) data.P5右下 = [];
                if (data.P5左下 === undefined) data.P5左下 = [];
                if (bossData.PosX > 100 && bossData.PosY < 100) data.P5右上.push(bossData);
                if (bossData.PosX > 100 && bossData.PosY > 100) data.P5右下.push(bossData);
                if (bossData.PosX < 100 && bossData.PosY > 100) data.P5左下.push(bossData);
                if (bossData.PosX < 100 && bossData.PosY < 100) data.P5左上.push(bossData);

            },
            alertText: (data, matches, output) => {
                let p5水晶 = data.P5左上.concat(data.P5右上, data.P5右下, data.P5左下);



                if (p5水晶.length >= 9) {
                    let bobao = ['左上', '右上', '右下', '左下'];
                    if (data.P5右上.length == 3) delete bobao[1];
                    if (data.P5右下.length == 3) delete bobao[2];
                    if (data.P5左下.length == 3) delete bobao[3];
                    if (data.P5左上.length == 3) delete bobao[0];
                    let distance;
                    if (data.P5右上.length == 2) {
                        data.P5右上.forEach(i => {
                            distance = Math.hypot(i.PosX - 100, i.PosY - 100);
                            if (distance < 8) delete bobao[1];
                        });
                    }
                    if (data.P5右下.length == 2) {
                        data.P5右下.forEach(i => {
                            distance = Math.hypot(i.PosX - 100, i.PosY - 100);
                            if (distance < 8) delete bobao[2];
                        });
                    }
                    if (data.P5左下.length == 2) {
                        data.P5左下.forEach(i => {
                            distance = Math.hypot(i.PosX - 100, i.PosY - 100);
                            if (distance < 8) delete bobao[3];
                        });
                    }
                    if (data.P5左上.length == 2) {
                        data.P5左上.forEach(i => {
                            distance = Math.hypot(i.PosX - 100, i.PosY - 100);
                            if (distance < 8) delete bobao[0];
                        });
                    }
                    bobao = bobao.filter(s => s && s.trim());
                    return `${bobao[0]}安全`
                }
            }
        },
    ],

});
