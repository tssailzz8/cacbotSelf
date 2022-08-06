let camera;
addOverlayListener("onPlayerControl", (e) => {
  camera=e.detail;
  //console.log(e.detail);
});
Options.Triggers.push({
    //副本区域
    zoneId: ZoneId.MatchAll,
    //触发器
    triggers: [
      // {
      //   //id
      //   id: 'General Provoke',
      //   //正则匹配
      //   netRegex: NetRegexes.ability({ id: '6503' }),
      //   //netRegex: NetRegexes.startsUsing({ id: '1D6D', capture: true }),
      //   //netRegex: NetRegexes.headMarker({ id: '003E' }),
      //   //netRegex: NetRegexes.tether({ id: '0005' }),
      //   //条件
      //   // condition: function(data, matches) {
      //   //   return true;
      //   // },
      //   //延迟
      //   delaySeconds:0.5,
      //   //持续时间
      //   durationSeconds:15,
      //   //多久之内接受一次
      //   suppressSeconds: 6,
      //   //弹出事件
      //   run: (data, matches, output) => {
      //     callOverlayHandler({ call: 'PostNamazu', c: 'mark', p:'{"ActorID":0x'+matches.sourceId+',"MarkType":'+9+'}'});
      //   },
      //   //promise: async (data, matches) => {},
      //   alertText: function(data, matches,output) {
      //     console.log(output.text());
      //     let name = data.ShortName(matches.source);
      //     return {
      //       en: 'Provoke: ' + name,
      //       cn: '123'+ name,
      //     };
      //   },
      // },
            {
        //id
        id: '找npc',
        //正则匹配
        netRegex: NetRegexes.ability({ id: '6503' }),

        //延迟
        delaySeconds:0.5,
        //持续时间
        durationSeconds:15,
        //多久之内接受一次
        suppressSeconds: 6,
        promise : async (data, matches)=>{
          let boss = await callOverlayHandler({
            call: 'getCombatants',
          });
          console.log(camera);
          //callOverlayHandler({ call: 'PostNamazu', c: 'mark', p:'{"ActorID":0x'+matches.sourceId+',"MarkType":'+2+'}'});
          //let boss1=boss.combatants.filter((a)=>a.BNpcID==10183&&a.BNpcNameID==541)[0];
        },
        //弹出事件
        run: (data, matches, output) => {},
        //promise: async (data, matches) => {},
        alertText: (data, matches,output) =>{
        },
      },
      {
      id: "PostNamazu Callback Test",
      netRegex: NetRegexes.gameNameLog({ line: "test", capture: false }),
      run: () => {
        callOverlayHandler({ call: 'PostNamazu', c: 'command', p: '/e 321' });
        
          let waymark = {
              A: {
                  Active: false
              }, 
              B: {
                  X: 124,
                  Y: 34,
                  Z: 24,
                  Active: true
              }
          };
          callOverlayHandler({ call: 'PostNamazu', c: 'place', p: JSON.stringify(waymark)});//执行place操作，进行本地标点
        // callOverlayHandler({ call: 'PostNamazu',c:'place',p:'{"A":{},"B":{"X":-63.199,"Y":18.0,"Z":-3.915,"Active":true}}'});//执行place操作，进行本地标点
      },
      alarmText: "发送指令",  
    },
    ],});