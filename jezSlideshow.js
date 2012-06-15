var jezSlideshow={initialize:function(element,options){this.setOptions({data:[],navigableBrowsing:false,showPlay:false,showBackward:true,showFastBackward:false,showForward:true,showFastForward:false,enableShuffle:false,populateData:true,destroyAfterPopulate:true,itemSelector:"li.jezSlideshowItem",titleSelector:"h3.title",contentSelector:"div.content",imageSelector:"img.image",thumbSelector:"img.thumb",linkSelector:"a.link",showIndex:true,indexesOrientation:'horizontal',showScrollingButtons:false,reverseScroll:false,hoverVelocity:.5,clickVelocity:1,moveVelocity:.1,showIndexInfo:true,showIndexButton:true,indexFx:true,indexEvent:'click',indexActiveCss:{},indexInactiveCss:{},indexActiveFx:{},indexInactiveFx:{},showInfo:true,infoFx:true,infoActiveCss:{},infoInactiveCss:{},infoActiveFx:{},infoInactiveFx:{},fxDuration:500,transitionFx:"crossfade",timed:true,delay:5000,autoStop:true,slideshowCssClass:'jezSlideshow',itemCssClass:'item',controlCssClass:'control',playCssClass:'play',backwardCssClass:'backward',fastBackwardCssClass:'fastBackward',forwardCssClass:'forward',fastForwardCssClass:'fastForward',indexCssClass:'index',toBeginCssClass:'toBegin',toEndCssClass:'toEnd',infoCssClass:'info',titleTag:'h3',playTitle:'Click to Play Slideshow',backwardTitle:'View Previous Item',fastBackwardTitle:'View Previous Item without Transition Effect',forwardTitle:'View Next Item',fastForwardTitle:'View Next Item without Transition Effect',toBeginTitle:'Scroll to Begin',toEndTitle:'Scroll to End'},options);this.element=element;this.items=this.options.data;this.options.data=null;this.fireEvent('onStart');if(this.options.populateData){var data=$A(this.items);data.extend(this.populate(this.items.length));this.items=data;}
this.curItem=0;this.maxItem=this.items.length;this.control=(this.options.showPlay||this.options.showBackward||this.options.showFastBackward||this.options.showForward||this.options.showFastForward);this.construct();this.initControl();if(this.options.showIndex){this.initIndex();this.indexScrolling();}
if(this.options.showInfo)
this.initInfo();if(this.options.navigableBrowsing){this.scroller=new Fx.Scroll(window,{duration:this.options.fxDuration});this.lastScroll=null;setInterval(function(){var item=this.getLocation();if(item>=0&&item<this.maxItem&&item!=this.curItem){this.goTo(item);if(this.options.timed&&this.options.autoStop)
this.stop();}
if(location.href.indexOf('#')>-1&&item!=this.lastScroll){this.scrollPage(item);this.lastScroll=item;}}.bind(this),100);}
this.start();this.fireEvent('onComplete');},populate:function(startFrom){var options=this.options;var data=Array();var i=startFrom;this.element.getElements(this.options.itemSelector).each(function(item){data[i]={title:options.titleSelector&&item.getElement(options.titleSelector)?item.getElement(options.titleSelector).innerHTML:'',content:options.contentSelector&&item.getElement(options.contentSelector)?item.getElement(options.contentSelector).innerHTML:'',image:options.imageSelector&&item.getElement(options.imageSelector)?item.getElement(options.imageSelector).src:'',thumb:options.thumbSelector&&item.getElement(options.thumbSelector)?item.getElement(options.thumbSelector).src:'',link:options.linkSelector&&item.getElement(options.linkSelector)?item.getElement(options.linkSelector).href:''};i+=1;if(options.destroyAfterPopulate)
item.remove();else
item.setStyle('display','none');});var elm=new Element('div').setProperty('id',this.element.getProperty('id')).injectBefore(this.element);if(options.destroyAfterPopulate)
this.element.replaceWith(elm);else
this.element.setProperty('id',this.element.getProperty('id')+'_bak').setStyle('display','none');this.element=elm;this.fireEvent('onReturnData');return data;},construct:function(){this.element.addClass(this.options.slideshowCssClass);this.itemsContainer=new Element('div',{'class':this.options.itemCssClass+'Container'}).injectInside(this.element);this.slides=[];for(var i=0;i<this.maxItem;i++){this.slides[i]=new Element('div',{'class':this.options.itemCssClass,'styles':{'opacity':0}}).injectInside(this.itemsContainer);this.fireEvent('onCreateSlide',i);}
this.slides=jezFxTransInit[this.options.transitionFx].pass([this.slides,this.options.fxDuration])();if(this.options.transitionFx=='accordion'){for(var i=0;i<this.maxItem;i++){this.slides.item(i).element.removeEvents('click').addEvent('click',function(n){this.goTo(n);if(this.options.autoStop)
this.stop();}.pass(i,this));}}},initControl:function(){if(this.control){this.control={};this.control.panel=new Element('div',{'class':this.options.controlCssClass}).injectInside(this.element);if(this.options.showFastBackward){this.control.fastBackward=new Element('a',{'class':this.options.fastBackwardCssClass,'events':{'click':function(){this.prevItem(true);if(this.options.autoStop)
this.stop();}.bind(this)}}).setProperty('title',this.options.fastBackwardTitle).injectInside(this.control.panel);}
if(this.options.showBackward){this.control.backward=new Element('a',{'class':this.options.backwardCssClass,'events':{'click':function(){this.prevItem();if(this.options.autoStop)
this.stop();}.bind(this)}}).setProperty('title',this.options.backwardTitle).injectInside(this.control.panel);}
if(this.options.showPlay){this.control.play=new Element('a',{'class':this.options.playCssClass,'events':{'click':function(button){if(this.options.timed){this.stop();}else{this.options.timed=true;this.nextItem();this.control.play.removeClass('paused').addClass('playing');}}.bind(this)}}).setProperty('title',this.options.playTitle).injectInside(this.control.panel);}
if(this.options.showForward){this.control.forward=new Element('a',{'class':this.options.forwardCssClass,'events':{'click':function(){this.nextItem();if(this.options.autoStop)
this.stop();}.bind(this)}}).setProperty('title',this.options.forwardTitle).injectInside(this.control.panel);}
if(this.options.showFastForward){this.control.fastForward=new Element('a',{'class':this.options.fastForwardCssClass,'events':{'click':function(){this.nextItem(true);if(this.options.autoStop)
this.stop();}.bind(this)}}).setProperty('title',this.options.fastForwardTitle).injectInside(this.control.panel);}}
this.fireEvent('onConstructed');},initIndex:function(){this.index={};this.index.panel=new Element('div',{'class':this.options.indexCssClass+'-'+this.options.indexesOrientation}).injectInside(this.element);this.index.wrapper=new Element('div',{'class':this.options.indexCssClass+'Wrapper'}).injectInside(this.index.panel);this.index.scroller=new Element('div',{'class':this.options.indexCssClass+'Scroller'}).injectInside(this.index.wrapper);this.index.indexes=new Element('div',{'class':this.options.indexCssClass+'Indexes'}).injectInside(this.index.scroller);if(this.options.showIndexInfo){this.index.info=new Element('span',{'class':this.options.indexCssClass+'Info'}).injectInside(this.index.wrapper);}
if(this.options.showIndexButton){this.index.button=new Element('a',{'class':this.options.indexCssClass+'Button'}).setHTML('Index').injectInside(this.index.panel);}
var href;this.index.thumbs=[];for(var i=0;i<this.maxItem;i++){this.index.thumbs[i]=new Element('a',{'class':this.options.itemCssClass+'Thumb','events':{'mouseenter':function(n){this.index.thumbs[n].addClass('hover');if(this.options.showIndexInfo)
this.index.info.setHTML('Item '+(n+1)+' / '+this.maxItem+': '+this.items[n].title);}.pass(i,this),'mouseleave':function(n){this.index.thumbs[n].removeClass('hover');if(this.options.showIndexInfo)
this.index.info.setHTML('Item '+(this.curItem+1)+' / '+this.maxItem+': '+this.items[this.curItem].title);}.pass(i,this),'click':function(n){this.goTo(n);if(this.options.autoStop)
this.stop();}.pass(i,this)}}).injectInside(this.index.indexes);if(this.options.navigableBrowsing){if(location.href.indexOf('#')>-1)
href=location.href.substring(0,location.href.indexOf('#'));else
href=location.href;this.index.thumbs[i].setProperty('href',href+'#'+this.element.getProperty('id')+':'+(i+1));}
this.fireEvent('onCreateIndex',i);}
if(this.options.indexFx){$extend(this.options.indexActiveFx,{duration:this.options.fxDuration});$extend(this.options.indexInactiveFx,{duration:this.options.fxDuration});this.index.panel=new jezFxStyle(this.index.panel,{activateOn:this.options.indexEvent=='click'?'click':'mouseenter',deactivateOn:this.options.indexEvent=='click'?'click':'mouseleave',activeCss:this.options.indexActiveCss,inactiveCss:this.options.indexInactiveCss,activeFx:this.options.indexActiveFx,inactiveFx:this.options.indexInactiveFx},(this.options.indexEvent=='click'&&this.options.showIndexButton)?this.index.button:null);}},indexScrolling:function(){var thumbSpace,thumbSize;if(this.options.indexesOrientation=='vertical'){var indexesHeight=0;for(var i=0;i<this.index.thumbs.length;i++){thumbSpace=parseInt(this.index.thumbs[i].getStyle('margin-top'))+parseInt(this.index.thumbs[i].getStyle('margin-bottom'));thumbSize=this.index.thumbs[i].offsetHeight;indexesHeight+=thumbSpace+thumbSize;}
this.index.indexes.setStyle('height',indexesHeight);if(parseInt(this.index.scroller.getStyle('height'))>this.itemsContainer.offsetHeight)
this.index.scroller.setStyle('height',this.itemsContainer.offsetHeight);}else{var indexesWidth=0;for(var i=0;i<this.index.thumbs.length;i++){thumbSpace=parseInt(this.index.thumbs[i].getStyle('margin-left'))+parseInt(this.index.thumbs[i].getStyle('margin-right'));thumbSize=this.index.thumbs[i].offsetWidth;indexesWidth+=thumbSpace+thumbSize;}
this.index.indexes.setStyle('width',indexesWidth);if(parseInt(this.index.scroller.getStyle('width'))>this.itemsContainer.offsetWidth)
this.index.scroller.setStyle('width',this.itemsContainer.offsetWidth);}
if((this.options.indexesOrientation=='horizontal'&&this.index.indexes.offsetWidth>this.index.scroller.offsetWidth)||(this.options.indexesOrientation=='vertical'&&this.index.indexes.offsetHeight>this.index.scroller.offsetHeight)){if(this.options.showScrollingButtons){this.index.wrapper.addClass('withScrollingButtons');var spacing;if(this.options.indexesOrientation=='vertical'){spacing=parseInt(this.index.wrapper.getStyle('margin-top'))+parseInt(this.index.wrapper.getStyle('margin-bottom'));this.index.scroller.setStyle('height',this.index.scroller.offsetHeight-spacing);}else{spacing=parseInt(this.index.wrapper.getStyle('margin-left'))+parseInt(this.index.wrapper.getStyle('margin-right'));this.index.scroller.setStyle('width',this.index.scroller.offsetWidth-spacing);}
this.index.scrollToBegin=new Element('a',{'class':this.options.toBeginCssClass,'events':{'mouseover':function(){this.index.scroller.manualScroll=true;this.index.scroller.over=true;this.scrollToBegin(this.options.hoverVelocity);}.bind(this),'mouseout':function(){this.index.scroller.manualScroll=false;this.index.scroller.over=false;}.bind(this),'mousedown':function(){this.index.scroller.down=true;this.scrollToBegin(this.options.clickVelocity);}.bind(this),'mouseup':function(){this.index.scroller.down=false;}.bind(this)}}).setProperty('title',this.options.toBeginTitle).injectInside(this.index.panel);this.index.scrollToEnd=new Element('a',{'class':this.options.toEndCssClass,'events':{'mouseover':function(){this.index.scroller.manualScroll=true;this.index.scroller.over=true;this.scrollToEnd(this.options.hoverVelocity);}.bind(this),'mouseout':function(){this.index.scroller.manualScroll=false;this.index.scroller.over=false;}.bind(this),'mousedown':function(){this.index.scroller.down=true;this.scrollToEnd(this.options.clickVelocity);}.bind(this),'mouseup':function(){this.index.scroller.down=false;}.bind(this)}}).setProperty('title',this.options.toEndTitle).injectInside(this.index.panel);this.index.scroller=new Fx.Scroll(this.index.scroller,{duration:this.options.fxDuration});this.index.scroller.onScrolling=false;this.index.scroller.curPos=0;}else{this.index.indexesScroller=new Scroller(this.index.scroller,{area:100,velocity:this.options.moveVelocity});if(window.ie)
this.index.indexesScroller.coord=new Function();this.index.scroller=new Fx.Scroll(this.index.scroller.addEvents({'mouseenter':this.index.indexesScroller.start.bind(this.index.indexesScroller),'mouseleave':this.index.indexesScroller.stop.bind(this.index.indexesScroller)}),{duration:this.options.fxDuration,onStart:this.index.indexesScroller.stop.bind(this.index.indexesScroller),onComplete:this.index.indexesScroller.start.bind(this.index.indexesScroller)});}}
this.fireEvent('onIndexInitialized');},updateIndex:function(ignoreFx){ignoreFx=$pick(ignoreFx,false);this.fireEvent('onIndexUpdate');if($defined(this.reqItem)&&this.reqItem!=this.curItem)
this.index.thumbs[this.curItem].removeProperty('id');var n=$pick(this.reqItem,this.curItem);this.index.thumbs[n].setProperty('id','activeIndex');if(this.options.showIndexInfo)
this.index.info.setHTML('Item '+(n+1)+' / '+this.maxItem+': '+this.items[n].title);if(this.index.scroller.element)
this.scrollTo(n);},scrollToBegin:function(v){if(!this.index.scroller.onScrolling){if(!this.options.reverseScroll&&this.index.scroller.curPos<=0)
return;this.index.scroller.onScrolling=true;var pos;if(this.options.indexesOrientation=='vertical'){if(this.index.scroller.curPos<=0)
pos=this.index.indexes.offsetHeight-this.index.thumbs[0].offsetHeight;else{pos=this.index.scroller.curPos-(this.index.thumbs[0].offsetHeight*v);while(this.index.indexes.offsetHeight-pos<=this.index.scroller.element.offsetHeight)
pos-=(this.index.thumbs[0].offsetHeight*v);}}else{if(this.index.scroller.curPos<=0)
pos=this.index.indexes.offsetWidth-this.index.thumbs[0].offsetWidth;else{pos=this.index.scroller.curPos-(this.index.thumbs[0].offsetWidth*v);while(this.index.indexes.offsetWidth-pos<=this.index.scroller.element.offsetWidth)
pos-=(this.index.thumbs[0].offsetWidth*v);}}
this.index.scroller.curPos=parseInt(pos);this.fireEvent('onScrollToBegin');if(this.options.indexesOrientation=='vertical'){this.index.scroller.stop().scrollTo(0,this.index.scroller.curPos).chain(function(){this.index.scroller.onScrolling=false;if(this.index.scroller.over&&!this.index.scroller.down)
this.scrollToBegin(this.options.hoverVelocity);else if(this.index.scroller.down)
this.scrollToBegin(this.options.clickVelocity);}.bind(this));}else{this.index.scroller.stop().scrollTo(this.index.scroller.curPos,0).chain(function(){this.index.scroller.onScrolling=false;if(this.index.scroller.over&&!this.index.scroller.down)
this.scrollToBegin(this.options.hoverVelocity);else if(this.index.scroller.down)
this.scrollToBegin(this.options.clickVelocity);}.bind(this));}}},scrollToEnd:function(v){if(!this.index.scroller.onScrolling){var diff;if(this.options.indexesOrientation=='vertical'){diff=this.index.indexes.offsetHeight-this.index.scroller.curPos;if(!this.options.reverseScroll&&diff<=this.index.scroller.element.offsetHeight)
return;}else{diff=this.index.indexes.offsetWidth-this.index.scroller.curPos;if(!this.options.reverseScroll&&diff<=this.index.scroller.element.offsetWidth)
return;}
this.index.scroller.onScrolling=true;if(this.index.scroller.curPos<0)
this.index.scroller.curPos=0;var pos;if(this.options.indexesOrientation=='vertical'){if(diff<=this.index.scroller.element.offsetHeight)
pos=0;else
pos=this.index.scroller.curPos+(this.index.thumbs[0].offsetHeight*v);}else{if(diff<=this.index.scroller.element.offsetWidth)
pos=0;else
pos=this.index.scroller.curPos+(this.index.thumbs[0].offsetWidth*v);}
this.index.scroller.curPos=parseInt(pos);this.fireEvent('onScrollToEnd');if(this.options.indexesOrientation=='vertical'){this.index.scroller.stop().scrollTo(0,this.index.scroller.curPos).chain(function(){this.index.scroller.onScrolling=false;if(this.index.scroller.over&&!this.index.scroller.down)
this.scrollToEnd(this.options.hoverVelocity);else if(this.index.scroller.down)
this.scrollToEnd(this.options.clickVelocity);}.bind(this));}else{this.index.scroller.stop().scrollTo(this.index.scroller.curPos,0).chain(function(){this.index.scroller.onScrolling=false;if(this.index.scroller.over&&!this.index.scroller.down)
this.scrollToEnd(this.options.hoverVelocity);else if(this.index.scroller.down)
this.scrollToEnd(this.options.clickVelocity);}.bind(this));}}},scrollTo:function(n){if(!this.index.scroller.manualScroll){var pos;if(this.options.indexesOrientation=='vertical'){pos=this.index.thumbs[n].offsetTop+(this.index.thumbs[n].offsetHeight/2);pos-=(this.index.scroller.element.offsetHeight/2);}else{pos=this.index.thumbs[n].offsetLeft+(this.index.thumbs[n].offsetWidth/2);pos-=(this.index.scroller.element.offsetWidth/2);}
this.index.scroller.curPos=parseInt(pos);this.fireEvent('onScrollToItem');if(this.options.indexesOrientation=='vertical')
this.index.scroller.stop().scrollTo(0,this.index.scroller.curPos);else
this.index.scroller.stop().scrollTo(this.index.scroller.curPos,0);}},initInfo:function(){this.info={};this.info.panel=new Element('div',{'class':this.options.infoCssClass}).injectInside(this.element);this.info.title=new Element(this.options.titleTag,{'class':this.options.infoCssClass+'Title'}).injectInside(this.info.panel);this.info.content=new Element('p',{'class':this.options.infoCssClass+'Content'}).injectInside(this.info.panel);if(this.options.infoFx){$extend(this.options.infoActiveFx,{duration:this.options.fxDuration});$extend(this.options.infoInactiveFx,{duration:this.options.fxDuration});this.info.panel=new jezFxStyle(this.info.panel,{addEventHandler:false,activeCss:this.options.infoActiveCss,inactiveCss:this.options.infoInactiveCss,activeFx:this.options.infoActiveFx,inactiveFx:this.options.infoInactiveFx});}
this.fireEvent('onInfoInitialized');},showInfo:function(ignoreFx){ignoreFx=$pick(ignoreFx,false);var n=$pick(this.reqItem,this.curItem);this.fireEvent('onInfoShow');this.info.title.setHTML(this.items[n].title);this.info.content.setHTML(this.items[n].content);if(this.options.infoFx&&!ignoreFx)
this.info.panel.activate();},hideInfo:function(ignoreFx){ignoreFx=$pick(ignoreFx,false);this.fireEvent('onInfoHide');if(this.options.infoFx&&!ignoreFx)
this.info.panel.deactivate();else{this.info.title.empty();this.info.content.empty();}},start:function(){this.fireEvent('onSlideshowStart');var item=this.getLocation();if(item>=0&&item<this.maxItem&&item!=this.curItem)
this.curItem=item;this.slides.item(this.curItem).activate().chain(function(){if(this.options.showInfo)
this.showInfo();}.bind(this));if(this.options.showIndex)
this.updateIndex();this.prepareTimer.delay(this.options.fxDuration,this);if(this.options.showPlay)
this.control.play.addClass(this.options.timed?'playing':'paused');},stop:function(){this.fireEvent('onSlideshowStop');this.clearTimer();this.options.timed=false;if(this.options.showPlay)
this.control.play.removeClass('playing').addClass('paused');},prevItem:function(ignoreFx){ignoreFx=$pick(ignoreFx,false);var prev;if(this.options.enableShuffle)
prev=$random(0,this.curItem>1?this.curItem:this.maxItem-1);else
prev=(this.curItem-1<=-1)?this.maxItem-1:this.curItem-1;this.goTo(prev,ignoreFx);this.setLocation();},nextItem:function(ignoreFx){ignoreFx=$pick(ignoreFx,false);var next;if(this.options.enableShuffle)
next=$random((this.curItem<this.maxItem-2)?this.curItem:0,this.maxItem-1);else
next=(this.curItem+1>=this.maxItem)?0:this.curItem+1;this.goTo(next,ignoreFx);this.setLocation();},goTo:function(n,ignoreFx){ignoreFx=$pick(ignoreFx,false);this.clearTimer();this.changeItem(n,ignoreFx);if(!ignoreFx)
this.prepareTimer.delay(this.options.fxDuration,this);else
this.prepareTimer();},changeItem:function(n,ignoreFx){if(this.curItem!=n){this.reqItem=n;ignoreFx=$pick(ignoreFx,false);this.fireEvent('onItemChange');for(var i=0;i<this.maxItem;i++){if((i!=this.curItem)){this.slides.item(i).set('inactive');if(this.options.showIndex)
this.index.thumbs[i].removeClass('active');}}
if(this.options.showInfo)
this.hideInfo(ignoreFx);if(!ignoreFx){jezFxTransProcess[this.options.transitionFx].pass([this.slides.item(this.curItem),this.slides.item(this.reqItem)])().chain(function(){if(this.options.showInfo)
this.showInfo(ignoreFx);}.bind(this));}else{this.slides.item(this.curItem).set('inactive');this.slides.item(this.reqItem).set('active');if(this.options.showInfo)
this.showInfo(ignoreFx);}
if(this.options.showIndex)
this.updateIndex(ignoreFx);this.curItem=this.reqItem;}},getLocation:function(){var sign='#'+this.element.getProperty('id')+':';if(location.href.indexOf(sign)>-1){var reqItem=location.href.substring(location.href.indexOf('#'));return(parseInt(reqItem.replace(sign,''))-1);}else
return 0;},setLocation:function(){if(this.options.navigableBrowsing){if(location.href.indexOf('#')>-1)
href=location.href.substring(0,location.href.indexOf('#'));else
href=location.href;location.href=href+'#'+this.element.getProperty('id')+':'+(this.curItem+1);}},scrollPage:function(item){if(this.options.navigableBrowsing)
this.scroller.stop().toElement(this.slides.item(item).element);},clearTimer:function(){if(this.options.timed)
$clear(this.timer);},prepareTimer:function(){if(this.options.timed)
this.timer=this.nextItem.delay(this.options.delay,this);},changeData:function(element,options){this.fireEvent('onDataChange');this.destroy();this.items=[];this.curItem=0;this.maxItem=0;options=$merge(this.options,options);this.initialize(element,options);},destroy:function(){this.element.empty();this.element.remove();}};jezSlideshow=new Class(jezSlideshow);jezSlideshow.implement(new Options,new Events);