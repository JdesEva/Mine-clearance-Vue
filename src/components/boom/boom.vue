<template>
  <div id="boom">
  	<div class="header">
  		<h3 class="text-center">扫雷</h3>
  		<p class="desc">默认区块数量 1600,最低雷数 {{defaultBoom}}</p>
		<form role="form" class="form-inline col-sm-8">
			<div class="form-group col-sm-8">
				<label for="boomNum" class="col-sm-4">雷的个数:</label>
				<input type="text" class="form-control col-sm-4" id="boomNum" 
				   placeholder="请输入雷的个数" v-model="boomNum" @keyup.enter="onload" maxlength="3">
				   <div class="col-sm-4 text-center">
				   		<button type="button" class="btn btn-success col-sm-10" @click="onload" ref="rep">提交</button>
				   </div> 
			</div>
			<button type="button" class="btn btn-info col-sm-2" @click="reset">重置</button>
		</form>
  	</div>
  	<div class="Area">
  		<div class="boomArea" ref="boomArea" v-show="showFlag">
  			<div class="boom" v-for="(item,index) in allSum" :key="index" @contextmenu.prevent="able && right(item-1,$event)"></div>
  		</div>
  		<div class="hideArea" ref="hideArea">
  			<div class="hide" v-for="(item,index) in allSum" @click="able && FindBoom(item-1,$event)" :key="index" @contextmenu.prevent="able && rightClick(item-1,$event)">$</div>
  		</div>
  	</div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
	data() {
		return {
			boomNum:'',//地雷个数
			allSum:1600,//区块总数量
			everyLine:40,//每行的个数
			showFlag:false,
			able:false,
			blank_arr:[],//空白区域数组
			EveArr:[],//分块完毕的数组
			boomSum:[],//地雷信息
			EveNineBox:[],//九宫格数字
			defaultBoom:160,//最低地雷数量,
			OpenArr:[],//已经展开的空白区域
		}
	},
	mounted (){
		
	},
	methods:{
		_initBoomSum (){//初始化地雷
			let boomSum = [];//储存雷的所有序号
			if(this.boomNum <= this.defaultBoom){
				this.boomNum = this.defaultBoom; //最低雷数160
			}
			for(let i = 0;i<this.boomNum;i++){//生成地雷序号
				do{
					var a = Math.floor(Math.random()*this.allSum);//生成随机数
				}while($.inArray(a,boomSum)>-1);
				boomSum.push(a);//将生成的不重复随机数存入数组,即地雷的序号
			}
			this.boomSum = boomSum;//存储地雷信息
			return boomSum;
		},
		_initBoomStr (boomSum){ //生成雷区字符串
			var str = '';
			for(let i = 0;i<this.allSum;i++){
				if($.inArray(i, boomSum) == -1){//非雷区
					str += ' '
				}else{
					str +='#' //雷区
				}
			}
			return str;
		},
		_initBorderArr (str){//初始化边界信息
			let border_arr = [];//储存边界数字
			for(let i=0;i<this.allSum;i++){
				if(i%40 == 0){  //最左列
					border_arr.push(i);
				}
				if((i+1)%40 == 0){ //最右列
					border_arr.push(i);
				}
				if(i<40 && i>= 0){ //最上列
					border_arr.push(i);
				}
				if(i>1560 && i<this.allSum){ //最下列
					border_arr.push(i)
				}
			}
			return border_arr;
		},
		_initEveNineBox (boomSum,border_arr,str){ //生成地雷周围9个格子的序号
			let EveNineBox = [];//存储地雷周围格子的信息
			for(let i=0;i<boomSum.length;i++){
				if($.inArray(boomSum[i],border_arr) == -1 && $.inArray((boomSum[i]-(this.everyLine+1)),boomSum) == -1){
					EveNineBox.push(boomSum[i]-(this.everyLine+1));//i-41
				}
				if($.inArray(boomSum[i],border_arr) == -1 && $.inArray((boomSum[i]-(this.everyLine)),boomSum) == -1){
					EveNineBox.push(boomSum[i]-(this.everyLine));//i-40
				}
				if($.inArray(boomSum[i],border_arr) == -1 && $.inArray((boomSum[i]-(this.everyLine-1)),boomSum) == -1){
					EveNineBox.push(boomSum[i]-(this.everyLine-1));//i-39
				}
				if($.inArray(boomSum[i],border_arr) == -1 && $.inArray((boomSum[i]-(1)),boomSum) == -1){
					EveNineBox.push(boomSum[i]-(1));//i-1
				}
				if($.inArray(boomSum[i],border_arr) == -1 && $.inArray((boomSum[i]+(1)),boomSum) == -1){
					EveNineBox.push(boomSum[i]+(1));//i+1
				}
				if($.inArray(boomSum[i],border_arr) == -1 && $.inArray((boomSum[i]+(this.everyLine-1)),boomSum) == -1){
					EveNineBox.push(boomSum[i]+(this.everyLine-1));//i+39)
				}
				if($.inArray(boomSum[i],border_arr) == -1 && $.inArray((boomSum[i]+(this.everyLine)),boomSum) == -1){
					EveNineBox.push(boomSum[i]+(this.everyLine));//i+40)
				}
				if($.inArray(boomSum[i],border_arr) == -1 && $.inArray((boomSum[i]+(this.everyLine+1)),boomSum) == -1){
					EveNineBox.push(boomSum[i]+(this.everyLine+1));//i+41)
				}

				/* ----------------------------------边界条件-------------*/

				/** 左边界 */
				if(boomSum[i]%40 == 0 ){
					if(boomSum[i]-(this.everyLine-1) >= 0 && $.inArray((boomSum[i]-(this.everyLine-1)), boomSum) == -1){
						EveNineBox.push(boomSum[i]-(this.everyLine-1));//i-39)
					}

					if($.inArray(boomSum[i]+1, boomSum) == -1){
						EveNineBox.push(boomSum[i]+1);//i+1)
					}

					if(boomSum[i]+(this.everyLine+1) < this.allSum && $.inArray((boomSum[i]+(this.everyLine+1)), boomSum) == -1){
						EveNineBox.push(boomSum[i]+(this.everyLine+1));//i+41)
					}

					if(boomSum[i]-this.everyLine >= 0 && $.inArray(boomSum[i]-this.everyLine,boomSum) == -1){
						EveNineBox.push(boomSum[i]-this.everyLine);//i-40)
					}

					if(boomSum[i]+this.everyLine < this.allSum && $.inArray(boomSum[i]+this.everyLine,boomSum) == -1){
						EveNineBox.push(boomSum[i]+this.everyLine);//i+40)
					}
				}

				/**********/

				/**右边界 */
				if((boomSum[i]+1)%40 ==0){
					if(boomSum[i]-this.everyLine >= 0 && $.inArray(boomSum[i]-this.everyLine, boomSum) == -1){
						EveNineBox.push(boomSum[i]-this.everyLine);//i-40)
					}

					if(boomSum[i]-(this.everyLine+1) >= 0 && $.inArray(boomSum[i]-(this.everyLine+1), boomSum) == -1){
						EveNineBox.push(boomSum[i]-(this.everyLine+1));//i-41)
					}

					if($.inArray(boomSum[i]-1, boomSum) == -1){
						EveNineBox.push(boomSum[i]-1);//i-1)
					}

					if(boomSum[i]+(this.everyLine-1) < this.allSum && $.inArray(boomSum[i]+(this.everyLine-1),boomSum) == -1){
						EveNineBox.push(boomSum[i]+(this.everyLine-1));//i+39)
					}

					if(boomSum[i]+this.everyLine < this.allSum && $.inArray(boomSum[i]+this.everyLine, boomSum) == -1){
						EveNineBox.push(boomSum[i]+this.everyLine);//i+40)
					}
				}

				/*********/


				/** 上边界*/

				if(boomSum[i] >0 && boomSum[i] < this.everyLine-1){//1-38
					if($.inArray(boomSum[i]-1, boomSum) == -1){
						EveNineBox.push(boomSum[i]-1);//i-1)
					}

					if($.inArray(boomSum[i]+1, boomSum) == -1){
						EveNineBox.push(boomSum[i]+1);//i+1)
					}

					if($.inArray(boomSum[i]+(this.everyLine-1), boomSum) == -1){
						EveNineBox.push(boomSum[i]+(this.everyLine-1));//i+39)
					}

					if($.inArray(boomSum[i]+this.everyLine, boomSum) == -1){
						EveNineBox.push(boomSum[i]+this.everyLine);//i+40)
					}

					if($.inArray(boomSum[i]+(this.everyLine+1), boomSum) == -1){
						EveNineBox.push(boomSum[i]+(this.everyLine+1));//i+41)
					}
				}

				/********/

				/** 下边界 */

				if(boomSum[i] > this.allSum - this.everyLine && boomSum[i] <this.allSum-1){ //1561-1598
					if($.inArray(boomSum[i]-(this.everyLine+1), boomSum) == -1){
						EveNineBox.push(boomSum[i]-(this.everyLine+1));//i-41)
					}

					if($.inArray(boomSum[i]-this.everyLine, boomSum) == -1){
						EveNineBox.push(boomSum[i]-this.everyLine);//i-40)
					}

					if($.inArray(boomSum[i]-(this.everyLine-1), boomSum) == -1){
						EveNineBox.push(boomSum[i]-(this.everyLine-1));//i-39)
					}

					if($.inArray(boomSum[i]-1, boomSum) == -1){
						EveNineBox.push(boomSum[i]-1);//i-1)
					}

					if($.inArray(boomSum[i]+1, boomSum) == -1){
						EveNineBox.push(boomSum[i]+1);//i+1)
					}
				}

				/********/

				/*---------------------------------------------------*/
			}
			this.EveNineBox = EveNineBox;//将九宫格的信息存储

			return EveNineBox;
		},
		_initNum (str,EveNineBox,border_arr,boomSum){ //初始化数字
			let boomstrings = '';//替换结果

			for(let i=0;i<str.length;i++){
				if($.inArray(i,boomSum) == -1 && $.inArray(i,EveNineBox) == -1 && $.inArray(i, border_arr) == -1){
					boomstrings += ' ';//空白区域
				}
				else if($.inArray(i, boomSum) == -1 && $.inArray(i, EveNineBox) > -1){
					boomstrings += '*';//数字区域---------------------------
				}else{
					boomstrings += str[i];//地雷区域
				}

			}
			return boomstrings;
		},
		addBoom (str){ //将地雷信息等添加到DOM元素中
			let tapList = this.$refs.boomArea.getElementsByClassName('boom');
			for( let i=0;i<tapList.length;i++){
				tapList[i].innerHTML = str[i];
				if(str[i] == '#'){
					tapList[i].style.background = '#dc3545';//地雷颜色
				}
				// if(str[i] == ' '){ //显示空白区域编号
				// 	tapList[i].innerHTML = i;
				// 	tapList[i].style.fontSize = '6px';				
				// }
			}
		},
		_initResult (EveNineBox,Initstr){
			var str = '';//最终结果
			let arr = [];//存储最终结果
			
			for(let i=0;i<EveNineBox.length;i++){
				var p = 0;//计数器
				for(let j=0;j<EveNineBox.length;j++){
					if(EveNineBox[i] == EveNineBox[j]){
						p++;
					}
				}
				arr.push({
					index:EveNineBox[i],
					count:p
				})
			}	


			/** 生成最终结果的字符串 */

			let arrstr = Initstr.split('');

			for(var i in arr){
				arrstr.splice(arr[i].index,1,arr[i].count);
			}
			str = arrstr.join('');

			return str;
		},
		onload (){
			this.showFlag = true;
			this.able = true;//可以开始点击
			let boomSum = this._initBoomSum();//获取地雷数据
			let boomStr = this._initBoomStr(boomSum);//生成地雷字符串，便于处理
			let BorderArr = this._initBorderArr(boomStr);
			let EveNineBox = this._initEveNineBox(boomSum,BorderArr,boomStr);
			let Initstr = this._initNum(boomStr,EveNineBox,BorderArr,boomSum);
			let str = this._initResult(EveNineBox,Initstr);
			this.addBoom(str);
			this._initBlank(boomSum);
			this.$refs.rep.disabled = true;
		},
		FindBoom (item,e){//开始扫雷
			e.currentTarget.style.zIndex = '-1';
			e.currentTarget.style.background = 'none';
			e.currentTarget.style.color = 'none';
			let boxList = this.$refs.hideArea.getElementsByClassName('hide');
			let boomSum = this.boomSum;//获取地雷信息,并存储进数组

			if($.inArray(item,boomSum) > -1){
				alert('Game Over');
				for(let i=0;i<boomSum.length;i++){ //显示出所有的地雷
					boxList[boomSum[i]].style.background = 'none';
					boxList[boomSum[i]].style.color = 'none';
					boxList[boomSum[i]].style.zIndex = '-1';
				}
				this.able = false;//游戏结束禁用点击
			}

			this.OpenBlank(item);
		},
		rightClick (item,e){//右击选项
			//console.info(item);

			let arr = this.OpenArr;//获取已经展开的空白区域

			if($.inArray(item, arr) ==-1){
				let boxList = this.$refs.hideArea.getElementsByClassName('hide');
				let tapList = this.$refs.boomArea.getElementsByClassName('boom');
				boxList[item].style.zIndex = '-1';//将这一块扔到最下面
				tapList[item].style.background = 'purple';
				tapList[item].style.color = 'purple';//改变颜色
			}
			
		},
		right (item,e){ //还原右击块
			let arr = this.OpenArr;//获取已经展开的空白区域
			if($.inArray(item, arr) == -1){
				let boxList = this.$refs.hideArea.getElementsByClassName('hide');
				let tapList = this.$refs.boomArea.getElementsByClassName('boom');
				boxList[item].style.zIndex = '99';//将下面的块扔上来
				tapList[item].style.background = '#ccc';
				tapList[item].style.color = '#000';//还原
			}
			
		},
		_initBlank (boomSum){ //初始化空白区域
			let EveNineBox = this.EveNineBox;//获取九宫格信息，并转成数组
			let arr = [];//合并完毕的数组

			for(let i=0;i<EveNineBox.length;i++){
				if( arr.indexOf(EveNineBox[i]) == -1){
					arr.push(EveNineBox[i]);
				}
			}

			/***将地雷序号和周边数字编号合并 */

			let result = [];//最终结果

			result = arr.concat(boomSum);//合并操作

			boomSum = arr = null;//释放内存

			/********/

			/***检测模块**/
			let blank_arr = [];//空白区域数组

			for(let i=0;i<this.allSum;i++){
				if($.inArray(i, result) == -1){
					blank_arr.push(i);//所有空白区域
				}
			}

			this.isNum(blank_arr);

			this.blank_arr = blank_arr;//储存所有空白区域

		},
		isNum (blank_arr){//检测(逐行检测)
			blank_arr.sort((a,b)=>{
				return a-b;
			});//数组排序
			let arr = [];//最终分块的空白区域

			let brr = [];//临时数组


			for(let i=0;i<blank_arr.length;i++){
				for(let j=0;j<arr.length;j++){
					let option1 = $.inArray(blank_arr[i]-1, blank_arr);//判断i-1在不在空白数组里
					let option2 = $.inArray(blank_arr[i]-this.everyLine, blank_arr);//判断i-40

					if((option1 == -1 && option2 == -1) || (blank_arr[i]%40 == 0 && option2 == -1) ){
						brr = [];//重置数组
					}
					else{
						//只需要搜索出i-40所在数组的索引，问题即可解决！！！！！！
						//brr = arr[j];
						//尚有一个bug，前后相连部分数组断裂
						// bug 原因,由于开始是由上至下检测,因而上面不连续的数组有可能到下面就连续了,但是大数组里面已经存在两个数组(实际上应该是一个),所以会导致首行不连续的空白区域序号数组会产生断裂的情况
						
						let a = $.inArray(blank_arr[i]-this.everyLine, arr[j]);//判断i-40在不在arr[j]数组中

						if(a > -1){
							brr = arr[j];
						}

					}
				}
				brr.push(blank_arr[i]);
				if($.inArray(brr, arr) == -1){
					arr.push(brr);
				}
						
			}


			console.info(arr)


			this.EveArr = arr;//存储数组
			

		},
		OpenBlank (num){ //空白展开
			let boxList = this.$refs.hideArea.getElementsByClassName('hide');//获取所有的区块

			let blank_arr = this.blank_arr;//获取空白区域并转成数组
			

			let arr = this.EveArr;//获取数组

			//console.info(arr);


			for(let i=0;i<arr.length;i++){

				var p = $.inArray(num, arr[i]);//获取当前点击块所在区间

				if(p>-1){
					for(let j=0;j<arr[i].length;j++){
						boxList[arr[i][j]].style.background = 'none';
						boxList[arr[i][j]].style.color = 'none';
						boxList[arr[i][j]].style.zIndex = '-1';
					}
				}
			}

			this.IsWin();

		},
		IsWin (){//判断是否获胜
			let boxList = this.$refs.hideArea.getElementsByClassName('hide');//获取所有的区块

			let blank_arr = this.blank_arr;

			let arr = [];//存储已经展开的空白区域	

			for(let i=0;i<boxList.length;i++){
				if(boxList[i].style.zIndex == '-1' && $.inArray(i, arr) == -1 && $.inArray(i, blank_arr > -1)){
					arr.push(i);
				}
			}

			this.OpenArr = arr;//存储已经展开的区域

			if(arr.length == blank_arr.length){
				alert('Game Win');
				this.reset();
			}

			//console.info(arr);
		},
		reset (){//刷新页面
			location.reload(true);
		},

	}
}
</script>


<style scoped>
	*{
		user-select: none;
		margin:0;
		padding: 0;
	}
	.desc{
		margin-left:6%;
	}
	.boomArea{
		width: 90%;
		border: 1px solid #000;
		display: flex;
		flex-wrap: wrap;
		position: absolute;
		left:5%;
	}
	.boom{
		width: 2.5%;
		min-height: 2.5%;
		background: #ccc;
		border:1px solid #fff;
		text-align: center;
		z-index: 50;
		cursor: pointer;
		z-index: 50;
	}
	
	.hideArea{
		width: 90%;
		border: 1px solid #000;
		display: flex;
		flex-wrap: wrap;
		position:absolute;
		left:5%;
		background: none;
	}

	.hide{
		width: 2.5%;
		min-height: 2.5%;
		background: skyblue;
		border:1px solid #fff;
		color:skyblue;
		text-align: center;
		z-index: 50;
		cursor: pointer;
		z-index: 99;
	}
</style>