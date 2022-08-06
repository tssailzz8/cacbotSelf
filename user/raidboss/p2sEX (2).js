const firstHeadmarker = parseInt('0103', 16);
const getHeadmarkerId = (data, matches) => {
    if (typeof data.decOffset === 'undefined')
        data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
    return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};
Options.Triggers.push({
    //副本区域
    zoneId: ZoneId.AsphodelosTheSecondCircleSavage,
    //触发器
    triggers: [
    //   {
    //     //id
    //     id: 'General Provoke',
    //     netRegex: NetRegexes.startsUsing(),

    //     alertText: function(data, matches,output) {
    //         if (parseInt(matches.sourceId,16)>0x40000000) {
    //             return '测试'
                
    //         }
    //     },
    //   },
    {
        // Aoe from head outside the arena
        id: 'P2S方向',
        type: 'StartsUsing',
        netRegex: NetRegexes.startsUsing({ id: '682E'}),
        promise : async (data, matches)=>{
            let boss = await callOverlayHandler({
              call: 'getCombatants',
            });
            let boss1=boss.combatants.filter((a)=>a.BNpcID==14442&&a.BNpcNameID==10348);
            console.log(boss1);
            data.海马位置=boss1.Posx;
          },
        alertText: (_data, matches, output) => {
            const xCoord = data.海马位置;
            if (xCoord > 100)
                return output.w();
            if (xCoord < 100)
                return output.e();
        },
        outputStrings: {
            e: '←左半场安全',
            w: '→右半场安全',
        },
    },
     
    ],});