"use strict";console.clear();const IS_MOBILE=window.innerWidth<=640,IS_DESKTOP=800<window.innerWidth,IS_HEADER=IS_DESKTOP&&window.innerHeight<300,IS_HIGH_END_DEVICE=(()=>{var e=navigator.hardwareConcurrency;return!!e&&(window.innerWidth<=1024?4:8)<=e})(),MAX_WIDTH=7680,MAX_HEIGHT=4320,GRAVITY=.9;let simSpeed=1;function getDefaultScaleFactor(){return IS_MOBILE?.9:IS_HEADER?.75:1}let stageW,stageH,quality=1,isLowQuality=!1,isNormalQuality=!0,isHighQuality=!1;const QUALITY_LOW=1,QUALITY_NORMAL=2,QUALITY_HIGH=3,SKY_LIGHT_NONE=0,SKY_LIGHT_DIM=1,SKY_LIGHT_NORMAL=2,COLOR={Red:"#ff0043",Green:"#14fc56",Blue:"#1e7fff",Purple:"#e60aff",Gold:"#ffbf36",White:"#ffffff"},INVISIBLE="_INVISIBLE_",PI_2=2*Math.PI,PI_HALF=.5*Math.PI,trailsStage=new Stage("trails-canvas"),mainStage=new Stage("main-canvas"),stages=[trailsStage,mainStage];function fullscreenEnabled(){return fscreen.fullscreenEnabled}function isFullscreen(){return!!fscreen.fullscreenElement}function toggleFullscreen(){fullscreenEnabled()&&(isFullscreen()?fscreen.exitFullscreen():fscreen.requestFullscreen(document.documentElement))}fscreen.addEventListener("fullscreenchange",()=>{store.setState({fullscreen:isFullscreen()})});const store={_listeners:new Set,_dispatch(t){this._listeners.forEach(e=>e(this.state,t))},state:{paused:!0,soundEnabled:!1,menuOpen:!1,openHelpTopic:null,fullscreen:isFullscreen(),config:{quality:String(IS_HIGH_END_DEVICE?QUALITY_HIGH:QUALITY_NORMAL),shell:"Random",size:IS_DESKTOP?"3":IS_HEADER?"1.2":"2",autoLaunch:!0,finale:!1,skyLighting:SKY_LIGHT_NORMAL+"",hideControls:IS_HEADER,longExposure:!1,scaleFactor:getDefaultScaleFactor()}},setState(e){var t=this.state;this.state=Object.assign({},this.state,e),this._dispatch(t),this.persist()},subscribe(e){return this._listeners.add(e),()=>this._listeners.remove(e)},load(){var t=localStorage.getItem("cm_fireworks_data");if(t){var{schemaVersion:t,data:e}=JSON.parse(t);const o=this.state.config;switch(t){case"1.1":o.quality=e.quality,o.size=e.size,o.skyLighting=e.skyLighting;break;case"1.2":o.quality=e.quality,o.size=e.size,o.skyLighting=e.skyLighting,o.scaleFactor=e.scaleFactor;break;default:throw new Error("version switch should be exhaustive")}console.log(`Loaded config (schema version ${t})`)}else if("1"===localStorage.getItem("schemaVersion")){let e;try{var a=localStorage.getItem("configSize");e="string"==typeof a&&JSON.parse(a)}catch(e){return console.log("Recovered from error parsing saved config:"),void console.error(e)}t=parseInt(e,10);0<=t&&t<=4&&(this.state.config.size=String(t))}},persist(){var e=this.state.config;localStorage.setItem("cm_fireworks_data",JSON.stringify({schemaVersion:"1.2",data:{quality:e.quality,size:e.size,skyLighting:e.skyLighting,scaleFactor:e.scaleFactor}}))}};function togglePause(e){var t=store.state.paused;let a;t!==(a="boolean"==typeof e?e:!t)&&store.setState({paused:a})}function toggleSound(e){"boolean"==typeof e?store.setState({soundEnabled:e}):store.setState({soundEnabled:!store.state.soundEnabled})}function toggleMenu(e){"boolean"==typeof e?store.setState({menuOpen:e}):store.setState({menuOpen:!store.state.menuOpen})}function updateConfig(e){e=e||getConfigFromDOM(),store.setState({config:Object.assign({},store.state.config,e)}),configDidUpdate()}function configDidUpdate(){store.state.config;quality=qualitySelector(),isLowQuality=quality===QUALITY_LOW,isNormalQuality=quality===QUALITY_NORMAL,isHighQuality=quality===QUALITY_HIGH,skyLightingSelector()===SKY_LIGHT_NONE&&(appNodes.canvasContainer.style.backgroundColor="#000"),Spark.drawWidth=quality===QUALITY_HIGH?.75:1}IS_HEADER||store.load();const isRunning=(e=store.state)=>!e.paused&&!e.menuOpen,soundEnabledSelector=(e=store.state)=>e.soundEnabled,canPlaySoundSelector=(e=store.state)=>isRunning(e)&&soundEnabledSelector(e),qualitySelector=()=>+store.state.config.quality,shellNameSelector=()=>store.state.config.shell,shellSizeSelector=()=>+store.state.config.size,finaleSelector=()=>store.state.config.finale,skyLightingSelector=()=>+store.state.config.skyLighting,scaleFactorSelector=()=>store.state.config.scaleFactor,helpContent={shellType:{header:"Shell Type",body:'The type of firework that will be launched. Select "Random" for a nice assortment!'},shellSize:{header:"Shell Size",body:"The size of the fireworks. Modeled after real firework shell sizes, larger shells have bigger bursts with more stars, and sometimes more complex effects. However, larger shells also require more processing power and may cause lag."},quality:{header:"Quality",body:"Overall graphics quality. If the animation is not running smoothly, try lowering the quality. High quality greatly increases the amount of sparks rendered and may cause lag."},skyLighting:{header:"Sky Lighting",body:'Illuminates the background as fireworks explode. If the background looks too bright on your screen, try setting it to "Dim" or "None".'},scaleFactor:{header:"Scale",body:"Allows scaling the size of all fireworks, essentially moving you closer or farther away. For larger shell sizes, it can be convenient to decrease the scale a bit, especially on phones or tablets."},autoLaunch:{header:"Auto Fire",body:"Launches sequences of fireworks automatically. Sit back and enjoy the show, or disable to have full control."},finaleMode:{header:"Finale Mode",body:'Launches intense bursts of fireworks. May cause lag. Requires "Auto Fire" to be enabled.'},hideControls:{header:"Hide Controls",body:"Hides the translucent controls along the top of the screen. Useful for screenshots, or just a more seamless experience. While hidden, you can still tap the top-right corner to re-open this menu."},fullscreen:{header:"Fullscreen",body:"Toggles fullscreen mode."},longExposure:{header:"Open Shutter",body:"Experimental effect that preserves long streaks of light, similar to leaving a camera shutter open."}},nodeKeyToHelpKey={shellTypeLabel:"shellType",shellSizeLabel:"shellSize",qualityLabel:"quality",skyLightingLabel:"skyLighting",scaleFactorLabel:"scaleFactor",autoLaunchLabel:"autoLaunch",finaleModeLabel:"finaleMode",hideControlsLabel:"hideControls",fullscreenLabel:"fullscreen",longExposureLabel:"longExposure"},appNodes={stageContainer:".stage-container",canvasContainer:".canvas-container",controls:".controls",menu:".menu",menuInnerWrap:".menu__inner-wrap",pauseBtn:".pause-btn",pauseBtnSVG:".pause-btn use",soundBtn:".sound-btn",soundBtnSVG:".sound-btn use",shellType:".shell-type",shellTypeLabel:".shell-type-label",shellSize:".shell-size",shellSizeLabel:".shell-size-label",quality:".quality-ui",qualityLabel:".quality-ui-label",skyLighting:".sky-lighting",skyLightingLabel:".sky-lighting-label",scaleFactor:".scaleFactor",scaleFactorLabel:".scaleFactor-label",autoLaunch:".auto-launch",autoLaunchLabel:".auto-launch-label",finaleModeFormOption:".form-option--finale-mode",finaleMode:".finale-mode",finaleModeLabel:".finale-mode-label",hideControls:".hide-controls",hideControlsLabel:".hide-controls-label",fullscreenFormOption:".form-option--fullscreen",fullscreen:".fullscreen",fullscreenLabel:".fullscreen-label",longExposure:".long-exposure",longExposureLabel:".long-exposure-label",helpModal:".help-modal",helpModalOverlay:".help-modal__overlay",helpModalHeader:".help-modal__header",helpModalBody:".help-modal__body",helpModalCloseBtn:".help-modal__close-btn"};function renderApp(e){var t="#icon-"+(e.paused?"play":"pause"),a="#icon-sound-"+(soundEnabledSelector()?"on":"off");appNodes.pauseBtnSVG.setAttribute("href",t),appNodes.pauseBtnSVG.setAttribute("xlink:href",t),appNodes.soundBtnSVG.setAttribute("href",a),appNodes.soundBtnSVG.setAttribute("xlink:href",a),appNodes.controls.classList.toggle("hide",e.menuOpen||e.config.hideControls),appNodes.canvasContainer.classList.toggle("blur",e.menuOpen),appNodes.menu.classList.toggle("hide",!e.menuOpen),appNodes.finaleModeFormOption.style.opacity=e.config.autoLaunch?1:.32,appNodes.quality.value=e.config.quality,appNodes.shellType.value=e.config.shell,appNodes.shellSize.value=e.config.size,appNodes.autoLaunch.checked=e.config.autoLaunch,appNodes.finaleMode.checked=e.config.finale,appNodes.skyLighting.value=e.config.skyLighting,appNodes.hideControls.checked=e.config.hideControls,appNodes.fullscreen.checked=e.fullscreen,appNodes.longExposure.checked=e.config.longExposure,appNodes.scaleFactor.value=e.config.scaleFactor.toFixed(2),appNodes.menuInnerWrap.style.opacity=e.openHelpTopic?.12:1,appNodes.helpModal.classList.toggle("active",!!e.openHelpTopic),e.openHelpTopic&&({header:t,body:a}=helpContent[e.openHelpTopic],appNodes.helpModalHeader.textContent=t,appNodes.helpModalBody.textContent=a)}function handleStateChange(e,t){e=canPlaySoundSelector(e);e!==canPlaySoundSelector(t)&&(e?soundManager.resumeAll():soundManager.pauseAll())}function getConfigFromDOM(){return{quality:appNodes.quality.value,shell:appNodes.shellType.value,size:appNodes.shellSize.value,autoLaunch:appNodes.autoLaunch.checked,finale:appNodes.finaleMode.checked,skyLighting:appNodes.skyLighting.value,longExposure:appNodes.longExposure.checked,hideControls:appNodes.hideControls.checked,scaleFactor:parseFloat(appNodes.scaleFactor.value)}}Object.keys(appNodes).forEach(e=>{appNodes[e]=document.querySelector(appNodes[e])}),fullscreenEnabled()||appNodes.fullscreenFormOption.classList.add("remove"),store.subscribe(renderApp),store.subscribe(handleStateChange);const updateConfigNoEvent=()=>updateConfig(),COLOR_NAMES=(appNodes.quality.addEventListener("input",updateConfigNoEvent),appNodes.shellType.addEventListener("input",updateConfigNoEvent),appNodes.shellSize.addEventListener("input",updateConfigNoEvent),appNodes.autoLaunch.addEventListener("click",()=>setTimeout(updateConfig,0)),appNodes.finaleMode.addEventListener("click",()=>setTimeout(updateConfig,0)),appNodes.skyLighting.addEventListener("input",updateConfigNoEvent),appNodes.longExposure.addEventListener("click",()=>setTimeout(updateConfig,0)),appNodes.hideControls.addEventListener("click",()=>setTimeout(updateConfig,0)),appNodes.fullscreen.addEventListener("click",()=>setTimeout(toggleFullscreen,0)),appNodes.scaleFactor.addEventListener("input",()=>{updateConfig(),handleResize()}),Object.keys(nodeKeyToHelpKey).forEach(e=>{const t=nodeKeyToHelpKey[e];appNodes[e].addEventListener("click",()=>{store.setState({openHelpTopic:t})})}),appNodes.helpModalCloseBtn.addEventListener("click",()=>{store.setState({openHelpTopic:null})}),appNodes.helpModalOverlay.addEventListener("click",()=>{store.setState({openHelpTopic:null})}),Object.keys(COLOR)),COLOR_CODES=COLOR_NAMES.map(e=>COLOR[e]),COLOR_CODES_W_INVIS=[...COLOR_CODES,INVISIBLE],COLOR_CODE_INDEXES=COLOR_CODES_W_INVIS.reduce((e,t,a)=>(e[t]=a,e),{}),COLOR_TUPLES={};function randomColorSimple(){return COLOR_CODES[Math.random()*COLOR_CODES.length|0]}COLOR_CODES.forEach(e=>{COLOR_TUPLES[e]={r:parseInt(e.substr(1,2),16),g:parseInt(e.substr(3,2),16),b:parseInt(e.substr(5,2),16)}});let lastColor;function randomColor(e){var t=e&&e.notSame,a=e&&e.notColor,e=e&&e.limitWhite;let o=randomColorSimple();if(e&&o===COLOR.White&&Math.random()<.6&&(o=randomColorSimple()),t)for(;o===lastColor;)o=randomColorSimple();else if(a)for(;o===a;)o=randomColorSimple();return lastColor=o}function whiteOrGold(){return Math.random()<.5?COLOR.Gold:COLOR.White}function makePistilColor(e){return e===COLOR.White||e===COLOR.Gold?randomColor({notColor:e}):whiteOrGold()}const crysanthemumShell=(e=1)=>{var t=Math.random()<.25,a=Math.random()<.72,o=a?randomColor({limitWhite:!0}):[randomColor(),randomColor({notSame:!0})],r=a&&Math.random()<.42,l=r&&makePistilColor(o),a=a&&(Math.random()<.2||o===COLOR.White)?l||randomColor({notColor:o,limitWhite:!0}):null,s=!r&&o!==COLOR.White&&Math.random()<.42;let n=t?1.1:1.25;return isLowQuality&&(n*=.8),{shellSize:e,spreadSize:300+100*e,starLife:900+200*e,starDensity:n=isHighQuality?1.2:n,color:o,secondColor:a,glitter:t?"light":"",glitterColor:whiteOrGold(),pistil:r,pistilColor:l,streamers:s}},ghostShell=(e=1)=>{const t=crysanthemumShell(e);t.starLife*=1.5;var e=randomColor({notColor:COLOR.White}),a=(t.streamers=!0,Math.random()<.42);a&&makePistilColor(e);return t.color=INVISIBLE,t.secondColor=e,t.glitter="",t},strobeShell=(e=1)=>{var t=randomColor({limitWhite:!0});return{shellSize:e,spreadSize:280+92*e,starLife:1100+200*e,starLifeVariation:.4,starDensity:1.1,color:t,glitter:"light",glitterColor:COLOR.White,strobe:!0,strobeColor:Math.random()<.5?COLOR.White:null,pistil:Math.random()<.5,pistilColor:makePistilColor(t)}},palmShell=(e=1)=>{var t=randomColor(),a=Math.random()<.5;return{shellSize:e,color:t,spreadSize:250+75*e,starDensity:a?.15:.4,starLife:1800+200*e,glitter:a?"thick":"heavy"}},ringShell=(e=1)=>{var t=randomColor(),a=Math.random()<.75;return{shellSize:e,ring:!0,color:t,spreadSize:300+100*e,starLife:900+200*e,starCount:2.2*PI_2*(e+1),pistil:a,pistilColor:makePistilColor(t),glitter:a?"":"light",glitterColor:t===COLOR.Gold?COLOR.Gold:COLOR.White,streamers:Math.random()<.3}},crossetteShell=(e=1)=>{var t=randomColor({limitWhite:!0});return{shellSize:e,spreadSize:300+100*e,starLife:750+160*e,starLifeVariation:.4,starDensity:.85,color:t,crossette:!0,pistil:Math.random()<.5,pistilColor:makePistilColor(t)}},floralShell=(e=1)=>({shellSize:e,spreadSize:300+120*e,starDensity:.12,starLife:500+50*e,starLifeVariation:.5,color:Math.random()<.65?"random":Math.random()<.15?randomColor():[randomColor(),randomColor({notSame:!0})],floral:!0}),fallingLeavesShell=(e=1)=>({shellSize:e,color:INVISIBLE,spreadSize:300+120*e,starDensity:.12,starLife:500+50*e,starLifeVariation:.5,glitter:"medium",glitterColor:COLOR.Gold,fallingLeaves:!0}),willowShell=(e=1)=>({shellSize:e,spreadSize:300+100*e,starDensity:.6,starLife:3e3+300*e,glitter:"willow",glitterColor:COLOR.Gold,color:INVISIBLE}),crackleShell=(e=1)=>{var t=Math.random()<.75?COLOR.Gold:randomColor();return{shellSize:e,spreadSize:380+75*e,starDensity:isLowQuality?.65:1,starLife:600+100*e,starLifeVariation:.32,glitter:"light",glitterColor:COLOR.Gold,color:t,crackle:!0,pistil:Math.random()<.65,pistilColor:makePistilColor(t)}},horsetailShell=(e=1)=>{var t=randomColor();return{shellSize:e,horsetail:!0,color:t,spreadSize:250+38*e,starDensity:.9,starLife:2500+300*e,glitter:"medium",glitterColor:Math.random()<.5?whiteOrGold():t,strobe:t===COLOR.White}};function randomShellName(){return Math.random()<.5?"Crysanthemum":shellNames[Math.random()*(shellNames.length-1)+1|0]}function randomShell(e){return shellTypes[randomShellName()](e)}function shellFromConfig(e){return shellTypes[shellNameSelector()](e)}const fastShellBlacklist=["Falling Leaves","Floral","Willow"];function randomFastShell(){var e="Random"===shellNameSelector();let t=(e?randomShellName:shellNameSelector)();if(e)for(;fastShellBlacklist.includes(t);)t=randomShellName();return shellTypes[t]}const shellTypes={Random:randomShell,Crackle:crackleShell,Crossette:crossetteShell,Crysanthemum:crysanthemumShell,"Falling Leaves":fallingLeavesShell,Floral:floralShell,Ghost:ghostShell,"Horse Tail":horsetailShell,Palm:palmShell,Ring:ringShell,Strobe:strobeShell,Willow:willowShell},shellNames=Object.keys(shellTypes);function init(){function e(e,t){e.innerHTML=t.reduce((e,t)=>e+=`<option value="${t.value}">${t.label}</option>`,"")}document.querySelector(".loading-init").remove(),appNodes.stageContainer.classList.remove("remove");let a="";shellNames.forEach(e=>a+=`<option value="${e}">${e}</option>`),appNodes.shellType.innerHTML=a,a="",['3"','4"','6"','8"','12"','16"'].forEach((e,t)=>a+=`<option value="${t}">${e}</option>`),appNodes.shellSize.innerHTML=a,e(appNodes.quality,[{label:"Low",value:QUALITY_LOW},{label:"Normal",value:QUALITY_NORMAL},{label:"High",value:QUALITY_HIGH}]),e(appNodes.skyLighting,[{label:"None",value:SKY_LIGHT_NONE},{label:"Dim",value:SKY_LIGHT_DIM},{label:"Normal",value:SKY_LIGHT_NORMAL}]),e(appNodes.scaleFactor,[.5,.62,.75,.9,1,1.5,2].map(e=>({value:e.toFixed(2),label:100*e+"%"}))),togglePause(!1),renderApp(store.state),configDidUpdate()}function fitShellPositionInBoundsH(e){return.64*e+.18}function fitShellPositionInBoundsV(e){return.75*e}function getRandomShellPositionH(){return fitShellPositionInBoundsH(Math.random())}function getRandomShellPositionV(){return fitShellPositionInBoundsV(Math.random())}function getRandomShellSize(){var e=shellSizeSelector(),t=Math.min(2.5,e),a=Math.random()*t,e=e-a,a=0===t?Math.random():1-a/t,t=Math.random()*(1-.65*a)*.5;return{size:e,x:fitShellPositionInBoundsH(Math.random()<.5?.5-t:.5+t),height:fitShellPositionInBoundsV(a)}}function launchShellFromConfig(e){const t=new Shell(shellFromConfig(shellSizeSelector()));var a=mainStage.width,o=mainStage.height;t.launch(e?e.x/a:getRandomShellPositionH(),e?1-e.y/o:getRandomShellPositionV())}function seqRandomShell(){var e=getRandomShellSize();const t=new Shell(shellFromConfig(e.size));t.launch(e.x,e.height);let a=t.starLife;return t.fallingLeaves&&(a=4600),900+600*Math.random()+a}function seqRandomFastShell(){const e=randomFastShell();var t=getRandomShellSize();const a=new Shell(e(t.size));a.launch(t.x,t.height);t=a.starLife;return 900+600*Math.random()+t}function seqTwoRandom(){var e=getRandomShellSize();const t=getRandomShellSize(),a=new Shell(shellFromConfig(e.size)),o=new Shell(shellFromConfig(t.size));var r=.2*Math.random()-.1;const l=.2*Math.random()-.1;a.launch(.3+r,e.height),setTimeout(()=>{o.launch(.7+l,t.height)},100);let s=Math.max(a.starLife,o.starLife);return(a.fallingLeaves||o.fallingLeaves)&&(s=4600),900+600*Math.random()+s}function seqTriple(){const a=randomFastShell();var e=shellSizeSelector();const o=Math.max(0,e-1.25);var t=.08*Math.random()-.04;const r=new Shell(a(e));r.launch(.5+t,.7);e=1e3+400*Math.random(),t=1e3+400*Math.random();return setTimeout(()=>{var e=.08*Math.random()-.04;const t=new Shell(a(o));t.launch(.2+e,.1)},e),setTimeout(()=>{var e=.08*Math.random()-.04;const t=new Shell(a(o));t.launch(.8+e,.1)},t),4e3}function seqPyramid(){var e=IS_DESKTOP?7:4;const r=shellSizeSelector(),l=Math.max(0,r-3),s=Math.random()<.78?crysanthemumShell:ringShell,n=randomShell;function t(e,t){let a="Random"===shellNameSelector()?t?n:s:shellTypes[shellNameSelector()];const o=new Shell(a(t?r:l));o.launch(e,t?.75:.42*(e<=.5?e/.5:(1-e)/.5))}let a=0,o=0;for(;a<=e;){if(a===e)setTimeout(()=>{t(.5,!0)},o);else{const h=a/e*.5;var i=30*Math.random()+30;setTimeout(()=>{t(h,!1)},o),setTimeout(()=>{t(1-h,!1)},o+i)}a++,o+=200}return 3400+250*e}function seqSmallBarrage(){seqSmallBarrage.lastCalled=Date.now();var e=IS_DESKTOP?11:5,t=IS_DESKTOP?3:1;const r=Math.max(0,shellSizeSelector()-2),l=Math.random()<.78?crysanthemumShell:ringShell,s=randomFastShell();function a(e,t){let a="Random"===shellNameSelector()?t?s:l:shellTypes[shellNameSelector()];const o=new Shell(a(r));t=(Math.cos(5*e*Math.PI+PI_HALF)+1)/2;o.launch(e,.75*t)}let o=0,n=0;for(;o<e;){if(0===o)a(.5,!1),o+=1;else{const h=(o+1)/e/2;var i=30*Math.random()+30;const c=o===t;setTimeout(()=>{a(.5+h,c)},n),setTimeout(()=>{a(.5-h,c)},n+i),o+=2}n+=200}return 3400+120*e}seqSmallBarrage.cooldown=15e3,seqSmallBarrage.lastCalled=Date.now();const sequences=[seqRandomShell,seqTwoRandom,seqTriple,seqPyramid,seqSmallBarrage];let isFirstSeq=!0;const finaleCount=32;let currentFinaleCount=0;function startSequence(){if(isFirstSeq){if(isFirstSeq=!1,IS_HEADER)return seqTwoRandom();{const t=new Shell(crysanthemumShell(shellSizeSelector()));return t.launch(.5,.5),2400}}if(finaleSelector())return seqRandomFastShell(),currentFinaleCount<finaleCount?(currentFinaleCount++,170):(currentFinaleCount=0,6e3);var e=Math.random();return e<.08&&Date.now()-seqSmallBarrage.lastCalled>seqSmallBarrage.cooldown?seqSmallBarrage():e<.1?seqPyramid():e<.6&&!IS_HEADER?seqRandomShell():e<.8?seqTwoRandom():e<1?seqTriple():void 0}let activePointerCount=0,isUpdatingSpeed=!1;function handlePointerStart(e){activePointerCount++;if(e.y<50){if(e.x<50)return void togglePause();if(e.x>mainStage.width/2-25&&e.x<mainStage.width/2+25)return void toggleSound();if(e.x>mainStage.width-50)return void toggleMenu()}isRunning()&&(updateSpeedFromEvent(e)?isUpdatingSpeed=!0:e.onCanvas&&launchShellFromConfig(e))}function handlePointerEnd(e){activePointerCount--,isUpdatingSpeed=!1}function handlePointerMove(e){isRunning()&&isUpdatingSpeed&&updateSpeedFromEvent(e)}function handleKeydown(e){80===e.keyCode?togglePause():79===e.keyCode?toggleMenu():27===e.keyCode&&toggleMenu(!1)}function handleResize(){var e=window.innerWidth,t=window.innerHeight;const a=Math.min(e,MAX_WIDTH),o=e<=420?t:Math.min(t,MAX_HEIGHT);appNodes.stageContainer.style.width=a+"px",appNodes.stageContainer.style.height=o+"px",stages.forEach(e=>e.resize(a,o));e=scaleFactorSelector();stageW=a/e,stageH=o/e}mainStage.addEventListener("pointerstart",handlePointerStart),mainStage.addEventListener("pointerend",handlePointerEnd),mainStage.addEventListener("pointermove",handlePointerMove),window.addEventListener("keydown",handleKeydown),handleResize(),window.addEventListener("resize",handleResize);let currentFrame=0,speedBarOpacity=0,autoLaunchTime=0;function updateSpeedFromEvent(e){return!!(isUpdatingSpeed||e.y>=mainStage.height-44)&&(e=(e.x-16)/(mainStage.width-32),simSpeed=Math.min(Math.max(e,0),1),speedBarOpacity=1,!0)}function updateGlobals(e,t){currentFrame++,isUpdatingSpeed||(speedBarOpacity-=t/30)<0&&(speedBarOpacity=0),store.state.config.autoLaunch&&(autoLaunchTime-=e)<=0&&(autoLaunchTime=1.25*startSequence())}function update(e,t){if(isRunning()){stageW,stageH;const n=e*simSpeed,i=simSpeed*t,h=(updateGlobals(n,t),1-(1-Star.airDrag)*i),c=1-(1-Star.airDragHeavy)*i,d=1-(1-Spark.airDrag)*i,u=n/1e3*GRAVITY;COLOR_CODES_W_INVIS.forEach(e=>{const t=Star.active[e];for(let e=t.length-1;0<=e;e-=1){const l=t[e];if(l.updateFrame!==currentFrame)if(l.updateFrame=currentFrame,l.life-=n,l.life<=0)t.splice(e,1),Star.returnInstance(l);else{var a=Math.pow(l.life/l.fullLife,.5),o=1-a;if(l.prevX=l.x,l.prevY=l.y,l.x+=l.speedX*i,l.y+=l.speedY*i,l.heavy?(l.speedX*=c,l.speedY*=c):(l.speedX*=h,l.speedY*=h),l.speedY+=u,l.spinRadius&&(l.spinAngle+=l.spinSpeed*i,l.x+=Math.sin(l.spinAngle)*l.spinRadius*i,l.y+=Math.cos(l.spinAngle)*l.spinRadius*i),l.sparkFreq)for(l.sparkTimer-=n;l.sparkTimer<0;)l.sparkTimer+=.75*l.sparkFreq+l.sparkFreq*o*4,Spark.add(l.x,l.y,l.sparkColor,Math.random()*PI_2,Math.random()*l.sparkSpeed*a,.8*l.sparkLife+Math.random()*l.sparkLifeVariation*l.sparkLife);l.life<l.transitionTime&&(l.secondColor&&!l.colorChanged&&(l.colorChanged=!0,l.color=l.secondColor,t.splice(e,1),Star.active[l.secondColor].push(l),l.secondColor===INVISIBLE&&(l.sparkFreq=0)),l.strobe&&(l.visible=Math.floor(l.life/l.strobeFreq)%3==0))}}const r=Spark.active[e];for(let e=r.length-1;0<=e;e-=1){const s=r[e];s.life-=n,s.life<=0?(r.splice(e,1),Spark.returnInstance(s)):(s.prevX=s.x,s.prevY=s.y,s.x+=s.speedX*i,s.y+=s.speedY*i,s.speedX*=d,s.speedY*=d,s.speedY+=u)}}),render(i)}}function render(e){var t=mainStage["dpr"],a=stageW,o=stageH;const r=trailsStage.ctx,l=mainStage.ctx;skyLightingSelector()!==SKY_LIGHT_NONE&&colorSky(e);var s=scaleFactorSelector();for(r.scale(t*s,t*s),l.scale(t*s,t*s),r.globalCompositeOperation="source-over",r.fillStyle=`rgba(0, 0, 0, ${store.state.config.longExposure?.0025:.175*e})`,r.fillRect(0,0,a,o),l.clearRect(0,0,a,o);BurstFlash.active.length;){var n=BurstFlash.active.pop();const i=r.createRadialGradient(n.x,n.y,0,n.x,n.y,n.radius);i.addColorStop(.024,"rgba(255, 255, 255, 1)"),i.addColorStop(.125,"rgba(255, 160, 20, 0.2)"),i.addColorStop(.32,"rgba(255, 140, 20, 0.11)"),i.addColorStop(1,"rgba(255, 120, 20, 0)"),r.fillStyle=i,r.fillRect(n.x-n.radius,n.y-n.radius,2*n.radius,2*n.radius),BurstFlash.returnInstance(n)}r.globalCompositeOperation="lighten",r.lineWidth=Star.drawWidth,r.lineCap=isLowQuality?"square":"round",l.strokeStyle="#fff",l.lineWidth=1,l.beginPath(),COLOR_CODES.forEach(e=>{const t=Star.active[e];r.strokeStyle=e,r.beginPath(),t.forEach(e=>{e.visible&&(r.moveTo(e.x,e.y),r.lineTo(e.prevX,e.prevY),l.moveTo(e.x,e.y),l.lineTo(e.x-1.6*e.speedX,e.y-1.6*e.speedY))}),r.stroke()}),l.stroke(),r.lineWidth=Spark.drawWidth,r.lineCap="butt",COLOR_CODES.forEach(e=>{const t=Spark.active[e];r.strokeStyle=e,r.beginPath(),t.forEach(e=>{r.moveTo(e.x,e.y),r.lineTo(e.prevX,e.prevY)}),r.stroke()}),speedBarOpacity&&(l.globalAlpha=speedBarOpacity,l.fillStyle=COLOR.Blue,l.fillRect(0,o-6,a*simSpeed,6),l.globalAlpha=1),r.setTransform(1,0,0,1,0,0),l.setTransform(1,0,0,1,0,0)}const currentSkyColor={r:0,g:0,b:0},targetSkyColor={r:0,g:0,b:0};function colorSky(e){var t=15*skyLightingSelector();let a=0;targetSkyColor.r=0,targetSkyColor.g=0,targetSkyColor.b=0,COLOR_CODES.forEach(e=>{var t=COLOR_TUPLES[e],e=Star.active[e].length;a+=e,targetSkyColor.r+=t.r*e,targetSkyColor.g+=t.g*e,targetSkyColor.b+=t.b*e});var o=Math.pow(Math.min(1,a/500),.3),r=Math.max(1,targetSkyColor.r,targetSkyColor.g,targetSkyColor.b);targetSkyColor.r=targetSkyColor.r/r*t*o,targetSkyColor.g=targetSkyColor.g/r*t*o,targetSkyColor.b=targetSkyColor.b/r*t*o;currentSkyColor.r+=(targetSkyColor.r-currentSkyColor.r)/10*e,currentSkyColor.g+=(targetSkyColor.g-currentSkyColor.g)/10*e,currentSkyColor.b+=(targetSkyColor.b-currentSkyColor.b)/10*e,appNodes.canvasContainer.style.backgroundColor=`rgb(${0|currentSkyColor.r}, ${0|currentSkyColor.g}, ${0|currentSkyColor.b})`}function createParticleArc(t,e,a,o,r){var l=e/a,s=t+e-.5*l;if(t<s)for(let e=t;e<s;e+=l)r(e+Math.random()*l*o);else for(let e=t;e>s;e+=l)r(e+Math.random()*l*o)}function createBurst(e,t,a=0,o=PI_2){var r=2*(.5*Math.sqrt(e/Math.PI))*Math.PI,l=r/2;for(let e=0;e<=l;e++){var s=e/l*PI_HALF,n=Math.cos(s),s=r*n,i=s*(o/PI_2),h=PI_2/s,c=Math.random()*h+a,d=.33*h;for(let e=0;e<i;e++){var u=Math.random()*d;t(h*e+c+u,n)}}}function crossetteEffect(t){createParticleArc(Math.random()*PI_HALF,PI_2,4,.5,e=>{Star.add(t.x,t.y,t.color,e,.6*Math.random()+.75,600)})}function floralEffect(a){createBurst(12+6*quality,(e,t)=>{Star.add(a.x,a.y,a.color,e,2.4*t,1e3+300*Math.random(),a.speedX,a.speedY)}),BurstFlash.add(a.x,a.y,46),soundManager.playSound("burstSmall")}function fallingLeavesEffect(o){createBurst(7,(e,t)=>{const a=Star.add(o.x,o.y,INVISIBLE,e,2.4*t,2400+600*Math.random(),o.speedX,o.speedY);a.sparkColor=COLOR.Gold,a.sparkFreq=144/quality,a.sparkSpeed=.28,a.sparkLife=750,a.sparkLifeVariation=3.2}),BurstFlash.add(o.x,o.y,46),soundManager.playSound("burstSmall")}function crackleEffect(t){var e=isHighQuality?32:16;createParticleArc(0,PI_2,e,1.8,e=>{Spark.add(t.x,t.y,COLOR.Gold,e,2.4*Math.pow(Math.random(),.45),300+200*Math.random())})}mainStage.addEventListener("ticker",update);class Shell{constructor(e){var t;Object.assign(this,e),this.starLifeVariation=e.starLifeVariation||.125,this.color=e.color||randomColor(),this.glitterColor=e.glitterColor||this.color,this.starCount||(e=e.starDensity||1,t=this.spreadSize/54,this.starCount=Math.max(6,t*t*e))}launch(e,t){var a=stageW,o=stageH-.45*stageH,e=e*(a-120)+60,a=stageH,t=Math.pow(.04*(a-(o-t*(o-50))),.64);const r=this.comet=Star.add(e,a,"string"==typeof this.color&&"random"!==this.color?this.color:COLOR.White,Math.PI,t*(this.horsetail?1.2:1),t*(this.horsetail?100:400));r.heavy=!0,r.spinRadius=MyMath.random(.32,.85),r.sparkFreq=32/quality,isHighQuality&&(r.sparkFreq=8),r.sparkLife=320,r.sparkLifeVariation=3,"willow"!==this.glitter&&!this.fallingLeaves||(r.sparkFreq=20/quality,r.sparkSpeed=.5,r.sparkLife=500),this.color===INVISIBLE&&(r.sparkColor=COLOR.Gold),.4<Math.random()&&!this.horsetail&&(r.secondColor=INVISIBLE,r.transitionTime=700*Math.pow(Math.random(),1.5)+500),r.onDeath=e=>this.burst(e.x,e.y),soundManager.playSound("lift")}burst(r,l){const s=this.spreadSize/96;let n,i,h,c,d,u=.25,t=!1;this.crossette&&(i=e=>{t||(soundManager.playSound("crackleSmall"),t=!0),crossetteEffect(e)}),this.crackle&&(i=e=>{t||(soundManager.playSound("crackle"),t=!0),crackleEffect(e)}),this.floral&&(i=floralEffect),this.fallingLeaves&&(i=fallingLeavesEffect),"light"===this.glitter?(h=400,c=.3,d=300,u=2):"medium"===this.glitter?(h=200,c=.44,d=700,u=2):"heavy"===this.glitter?(h=80,c=.8,d=1400,u=2):"thick"===this.glitter?(h=16,c=isHighQuality?1.65:1.5,d=1400,u=3):"streamer"===this.glitter?(h=32,c=1.05,d=620,u=2):"willow"===this.glitter&&(h=120,c=.34,d=1400,u=3.8),h/=quality;var e,a,o,p=(e,t)=>{var a=this.spreadSize/1800;const o=Star.add(r,l,n||randomColor(),e,t*s,this.starLife+Math.random()*this.starLife*this.starLifeVariation,this.horsetail?this.comet&&this.comet.speedX:0,this.horsetail?this.comet&&this.comet.speedY:-a);this.secondColor&&(o.transitionTime=this.starLife*(.05*Math.random()+.32),o.secondColor=this.secondColor),this.strobe&&(o.transitionTime=this.starLife*(.08*Math.random()+.46),o.strobe=!0,o.strobeFreq=20*Math.random()+40,this.strobeColor&&(o.secondColor=this.strobeColor)),o.onDeath=i,this.glitter&&(o.sparkFreq=h,o.sparkSpeed=c,o.sparkLife=d,o.sparkLifeVariation=u,o.sparkColor=this.glitterColor,o.sparkTimer=Math.random()*o.sparkFreq)};if("string"==typeof this.color)if(n="random"===this.color?null:this.color,this.ring){const m=Math.random()*Math.PI,g=.85*Math.pow(Math.random(),2)+.15;createParticleArc(0,PI_2,this.starCount,0,e=>{var t=Math.sin(e)*s*g,e=Math.cos(e)*s,a=MyMath.pointDist(0,0,t,e),t=MyMath.pointAngle(0,0,t,e)+m;const o=Star.add(r,l,n,t,a,this.starLife+Math.random()*this.starLife*this.starLifeVariation);this.glitter&&(o.sparkFreq=h,o.sparkSpeed=c,o.sparkLife=d,o.sparkLifeVariation=u,o.sparkColor=this.glitterColor,o.sparkTimer=Math.random()*o.sparkFreq)})}else createBurst(this.starCount,p);else{if(!Array.isArray(this.color))throw new Error("Invalid shell color. Expected string or array of strings, but got: "+this.color);Math.random()<.5?(e=(o=Math.random()*Math.PI)+Math.PI,a=Math.PI,n=this.color[0],createBurst(this.starCount,p,o,a),n=this.color[1],createBurst(this.starCount,p,e,a)):(n=this.color[0],createBurst(this.starCount/2,p),n=this.color[1],createBurst(this.starCount/2,p))}if(this.pistil){const S=new Shell({spreadSize:.5*this.spreadSize,starLife:.6*this.starLife,starLifeVariation:this.starLifeVariation,starDensity:1.4,color:this.pistilColor,glitter:"light",glitterColor:this.pistilColor===COLOR.Gold?COLOR.Gold:COLOR.White});S.burst(r,l)}if(this.streamers){const f=new Shell({spreadSize:.9*this.spreadSize,starLife:.8*this.starLife,starLifeVariation:this.starLifeVariation,starCount:Math.floor(Math.max(6,this.spreadSize/45)),color:COLOR.White,glitter:"streamer"});f.burst(r,l)}BurstFlash.add(r,l,this.spreadSize/4),this.comet&&(o=.3*(1-Math.min(2,shellSizeSelector()-this.shellSize)/2)+.7,soundManager.playSound("burst",o))}}const BurstFlash={active:[],_pool:[],_new(){return{}},add(e,t,a){const o=this._pool.pop()||this._new();return o.x=e,o.y=t,o.radius=a,this.active.push(o),o},returnInstance(e){this._pool.push(e)}};function createParticleCollection(){const t={};return COLOR_CODES_W_INVIS.forEach(e=>{t[e]=[]}),t}const Star={drawWidth:3,airDrag:.98,airDragHeavy:.992,active:createParticleCollection(),_pool:[],_new(){return{}},add(e,t,a,o,r,l,s,n){const i=this._pool.pop()||this._new();return i.visible=!0,i.heavy=!1,i.x=e,i.y=t,i.prevX=e,i.prevY=t,i.color=a,i.speedX=Math.sin(o)*r+(s||0),i.speedY=Math.cos(o)*r+(n||0),i.life=l,i.fullLife=l,i.spinAngle=Math.random()*PI_2,i.spinSpeed=.8,i.spinRadius=0,i.sparkFreq=0,i.sparkSpeed=1,i.sparkTimer=0,i.sparkColor=a,i.sparkLife=750,i.sparkLifeVariation=.25,i.strobe=!1,this.active[a].push(i),i},returnInstance(e){e.onDeath&&e.onDeath(e),e.onDeath=null,e.secondColor=null,e.transitionTime=0,e.colorChanged=!1,this._pool.push(e)}},Spark={drawWidth:0,airDrag:.9,active:createParticleCollection(),_pool:[],_new(){return{}},add(e,t,a,o,r,l){const s=this._pool.pop()||this._new();return s.x=e,s.y=t,s.prevX=e,s.prevY=t,s.color=a,s.speedX=Math.sin(o)*r,s.speedY=Math.cos(o)*r,s.life=l,this.active[a].push(s),s},returnInstance(e){this._pool.push(e)}},soundManager={baseURL:"https://www.iculture.cc/demo/fireworks/mp3/",ctx:new(window.AudioContext||window.webkitAudioContext),sources:{lift:{volume:1,playbackRateMin:.85,playbackRateMax:.95,fileNames:["lift1.mp3","lift2.mp3","lift3.mp3"]},burst:{volume:1,playbackRateMin:.8,playbackRateMax:.9,fileNames:["burst1.mp3","burst2.mp3"]},burstSmall:{volume:.25,playbackRateMin:.8,playbackRateMax:1,fileNames:["burst-sm-1.mp3","burst-sm-2.mp3"]},crackle:{volume:.2,playbackRateMin:1,playbackRateMax:1,fileNames:["crackle1.mp3"]},crackleSmall:{volume:.3,playbackRateMin:1,playbackRateMax:1,fileNames:["crackle-sm-1.mp3"]}},preload(){const r=[];function l(e){if(200<=e.status&&e.status<300)return e;const t=new Error(e.statusText);throw t.response=e,t}const e=Object.keys(this.sources);return e.forEach(e=>{const t=this.sources[e],a=t["fileNames"],o=[];a.forEach(e=>{e=this.baseURL+e,e=fetch(e).then(l).then(e=>e.arrayBuffer()).then(t=>new Promise(e=>{this.ctx.decodeAudioData(t,e)}));o.push(e),r.push(e)}),Promise.all(o).then(e=>{t.buffers=e})}),Promise.all(r)},pauseAll(){this.ctx.suspend()},resumeAll(){this.playSound("lift",0),setTimeout(()=>{this.ctx.resume()},250)},_lastSmallBurstTime:0,playSound(e,t=1){if(t=MyMath.clamp(t,0,1),canPlaySoundSelector()&&!(simSpeed<.95)){if("burstSmall"===e){var a=Date.now();if(a-this._lastSmallBurstTime<20)return;this._lastSmallBurstTime=a}a=this.sources[e];if(!a)throw new Error(`Sound of type "${e}" doesn't exist.`);e=a.volume*t,t=MyMath.random(a.playbackRateMin,a.playbackRateMax)*(2-t);const o=this.ctx.createGain();o.gain.value=e;e=MyMath.randomChoice(a.buffers);const r=this.ctx.createBufferSource();r.playbackRate.value=t,r.buffer=e,r.connect(o),o.connect(this.ctx.destination),r.start(0)}}};function setLoadingStatus(e){document.querySelector(".loading-init__status").textContent=e}IS_HEADER?init():(setLoadingStatus("♥献给最爱的你"),setTimeout(()=>{soundManager.preload().then(init,e=>(init(),Promise.reject(e)))},0));