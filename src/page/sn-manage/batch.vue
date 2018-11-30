<template>
  	<div class="">
  		<div class=''>
  			<div class='flex'>
  				<el-input v-model="search_batch_num" placeholder="批次编号查询" class='search marginR20 width200'></el-input>
	  			<el-input v-model="search_firm_num" placeholder="厂商编号查询" class='search marginR20 width200'></el-input>
  			</div>
  			<div class=''>
  				<div class="center size12 marginB10 colorb9 cp" @click='height=true'>
  					高级搜索
  				</div>
  				<div class="senior" :class='height ? "senior-max-height" : ""'>
  					<div class="marginB20">
  						<el-select v-model="device_status" placeholder="设备码状态" class=''>
						    <el-option v-for="item in device_status_arr" :key="item" :label="item" :value="item"> </el-option>
						</el-select>
						<el-select v-model="activate" placeholder="是否激活" class=''>
						    <el-option label="是" value="1"> </el-option>
						    <el-option label="否" value="0"> </el-option>
						</el-select>
					    <el-date-picker v-model="found_time" type="daterange" range-separator="至" start-placeholder="创建日期" end-placeholder="创建日期"> </el-date-picker>
					    <el-date-picker v-model="update_time" type="daterange" range-separator="至" start-placeholder="更新日期" end-placeholder="更新日期"> </el-date-picker>
						<el-input v-model="search_did" placeholder="DID查询" class='search  width200'></el-input>
						<el-input v-model="search_key" placeholder="KEY查询" class='search  width200'></el-input>
  					</div>
  					<div class="marginB20">
  						<el-button plain @click='current_type="all"' :type='current_type=="all" ? "primary" : ""'>全部</el-button>
  						<el-button plain v-for='(val,index) in type_list' :key='val' @click='current_type=val' :type='current_type==val ? "primary" : ""'>{{val}}</el-button>
  					</div>
  					<div class='center'> 
  						<el-button plain @click='height=false'>返回</el-button>
  					</div>
  				</div>
  			</div>
  			<div>
  				<el-button type="primary" @click='query'>查询</el-button>
  				<router-link to='/found-SN' class='btn'>创建SN</router-link>
  				<template v-if='status=="batch"'>
  					<el-button type="primary" @click='derive_all'>导出勾选</el-button>
  				</template>	
  				<template v-if='status=="sn"'>
  					<el-button >报废</el-button>
  					<el-button >维修</el-button>
  					<el-button >返修</el-button>
  					<el-button >返修完成</el-button>
  					<el-button  @click='sn_export'>导出勾选</el-button>
  				</template>
  			</div>
  		</div>

  		<div class='marginT20 margin0'>
  			<el-button :type="status=='sn' ? 'primary' : ''" @click='status="sn"'>SN</el-button>
  			<el-button :type="status=='batch' ? 'primary' : ''" @click='status="batch"'>批次</el-button>
  		</div>
  		<!-- 批次号列表 -->
  		<el-table :data="batchList" style="width: 100%" @selection-change="handleSelectionChange" v-show='status=="batch"'>
  		  <el-table-column type="selection" width="55"> </el-table-column>
	      <el-table-column type="index" width="50"> </el-table-column>
	      <el-table-column prop='batch' label="批次号"></el-table-column>
	      <el-table-column prop="SNCount" label="SN生成个数"> </el-table-column>
	      <el-table-column label="状态" width='300'> 
			<template slot-scope='scope'>
				<el-button type="primary" size="mini" v-for='(val,key) in scope.row.StatusMap' :key='key'>{{key}}:{{val}}</el-button>
			</template>
	      </el-table-column>
	      <el-table-column prop="CreateTime" label="生成时间" width='170'> </el-table-column>

	      <el-table-column prop="UpdateTime" label="更新时间" width='170'> </el-table-column>
	      <el-table-column prop="ManufactNum" label="厂商编号"> </el-table-column>
	      <!-- <el-table-column prop="name" label="厂商名称"> </el-table-column> -->
		  <el-table-column prop="ExportCount" label="导出次数"> </el-table-column>

	      <el-table-column label="操作" width='200'>
	      	<template slot-scope="scope">
		        <el-button type="primary" size="mini" @click='query_sn(scope.row.batch)'>查询SN</el-button>
		        <el-button type="success" :loading="loading_status" size="mini" @click='derive(scope.row)'>导出下载</el-button>
		    </template>
	      </el-table-column>
	    </el-table>
	    <!-- sn列表 -->
	    <el-table :data="snList" style="width: 100%" @selection-change="snChange" v-show='status=="sn"' class='marginB20'>
  		  <el-table-column type="selection" width="55"> </el-table-column>
	      <el-table-column type="index" width="50"> </el-table-column>
	      <el-table-column prop='SN' label="SN编号" width='150'></el-table-column>
	      <el-table-column label="编号（KEY,DID）">
	      	<template slot-scope='scope'>
	      		<p>KEY:{{scope.row.KEY}}</p>
	      		<p>DID:{{scope.row.DID}}</p>
	      	</template>
	      </el-table-column>
	      <el-table-column prop="CreateTime" label="生成时间" width='170'> </el-table-column>
	      <el-table-column prop="UpdateTime" label="更新时间" width='170'> </el-table-column>
	      <el-table-column prop="batch" label="批次号"> </el-table-column>
	      <el-table-column prop="ManufactNum" label="厂商编号"> </el-table-column>
	      <!-- <el-table-column prop="name" label="厂商名称"> </el-table-column> -->

		  <el-table-column label="状态" width='300'> 
			<template slot-scope='scope'>
				<el-button type="primary" size="mini" v-for='(val,index) in scope.row.StatusRecords' :key='val.Status'>
					{{val.Status}}<br>
					{{val.Time}}<br>
					{{val.Comment}}
				</el-button>
			</template>
	      </el-table-column>
		  <!-- <el-table-column prop="ManufactNum" label="出入库"> </el-table-column> -->

		  <!-- <el-table-column prop="ExportCount" label="导出次数"> </el-table-column> -->

	      <el-table-column label="操作" width='200'>
	      	<template slot-scope="scope">
		        <router-link class='btn' :to='{path:"/details",query:{obj:JSON.stringify(scope.row)}}'>查询</router-link>
		    </template>
	      </el-table-column>
	    </el-table>
	    <!-- <el-pagination background layout="prev, pager, next" @current-change='page' :page-size='10' :total="1000"></el-pagination> -->
  	</div>
</template>

<script>
var XLSX = require('xlsx')
export default {
	data () {
	    return {
	    	search_batch_num:'',//批次号查询条件
	    	search_firm_num:'',//厂商编号查询
	    	found_time:'',//创建时间
	    	update_time:'',//更新时间
	    	search_did:'',//did查询
	    	search_key:'',//key查询,
	    	type_list:['类型1','类型2','类型3','类型4','类型5','类型6',],//产品类型
	    	current_type:'',//选中的产品类型
	    	activate:'',//激活
	    	device_status:'',//设备状态
	    	device_status_arr:['状态1','状态2','状态3','状态4','状态5',],
	    	batchList:[],//批次号列表
	    	snList:[],//设备列表
	    	height:false,
	    	status:'batch',
	    	loading_status:false,
	    	checkbox_arr:[],//多选框
	    	checkbox_sn_arr:[],//sn多选框
	    	query_sn_arr:[],//查询sn使用
	    	query_batch_arr:[],//查询批次使用
	    }
	},
	created(){
		this.current_type=localStorage.getItem('current_type') || ''
		this.batch_list()
		this.sn_list()
	},
	mounted () {
  	},
	methods: {
		batch_list(){//批次列表
			var self=this
        	this.ajax({
        		url:'/batch',
        		mode:'get',
        		data:{},
        		success(res){

        			for(let i=0;i<res.data.data.length;i++){
        				res.data.data[i].batch = res.data.data[i].TimeNum + (res.data.data[i].BatchNum<10 ? '00'+res.data.data[i].BatchNum : '0'+res.data.data[i].BatchNum)
        				res.data.data[i].CreateTime=res.data.data[i].CreateTime ? self.TIME(res.data.data[i].CreateTime) : 0
        				res.data.data[i].UpdateTime=res.data.data[i].UpdateTime ? self.TIME(res.data.data[i].UpdateTime) : 0
        			}
        			self.batchList=self.query_batch_arr=res.data.data
        		}
        	})
		},
		sn_list(num){//设备列表
			var url= num ? '/device/batch/'+num : '/device'
			var self=this
			self.snList=[]
			self.query_sn_arr=[]
			this.ajax({
        		url:url,
        		mode:'get',
        		data:{},
        		success(res){
        			for(let i=0;i<res.data.data.length;i++){
    					res.data.data[i].batch = res.data.data[i].TimeNum + (res.data.data[i].BatchNum<10 ? '00'+res.data.data[i].BatchNum : '0'+res.data.data[i].BatchNum)
        				res.data.data[i].CreateTime=res.data.data[i].CreateTime ? self.TIME(res.data.data[i].CreateTime) : 0
        				res.data.data[i].UpdateTime=res.data.data[i].UpdateTime ? self.TIME(res.data.data[i].UpdateTime) : 0

        				if(res.data.data[i].StatusRecords && res.data.data[i].StatusRecords.length>0){
        					for(let j=0;j<res.data.data[i].StatusRecords.length;j++){
	        					res.data.data[i].StatusRecords[j].Time=self.TIME(res.data.data[i].StatusRecords[j].Time)
	        				}
        				}
        				self.snList.push(res.data.data[i])
        				self.query_sn_arr.push(res.data.data[i])
        			}
        			if(num){
        				self.status='sn'
        			}
        		}
        	})
		},
		query_sn(batch){//查询sn
			this.sn_list(batch)
		},
        query(){//查询
        	localStorage.current_type=this.current_type
        	if(this.search_batch_num && !this.search_firm_num){
        		if(this.status=="batch"){/*批次查询*/
	        		this.batchList=[]
	        		this.batchList=this.batchList.concat(this.query_style_batch(this.query_batch_arr))
	        	}else{
	        		this.snList=[]
	        		this.snList=this.snList.concat(this.query_style_batch(this.query_sn_arr))
	        	}
        	}else if(!this.search_batch_num && this.search_firm_num){
        		if(this.status=="batch"){/*批次查询*/
	        		this.batchList=[]
	        		this.batchList=this.batchList.concat(this.query_style_sn(this.query_batch_arr))
	        	}else{
	        		this.snList=[]
	        		this.snList=this.snList.concat(this.query_style_sn(this.query_sn_arr))
	        	}
        	}else{
        		if(this.status=="batch"){/*批次查询*/
	        		this.batchList=[]
	        		this.batchList=this.batchList.concat(this.query_style_all(this.query_batch_arr))
	        	}else{
	        		this.snList=[]
	        		this.snList=this.snList.concat(this.query_style_all(this.query_sn_arr))
	        	}
        	}
        	
        },
        handleSelectionChange(val){//批次多选框
       		this.checkbox_arr=val
        },
        snChange(val){//sn多选框
        	this.checkbox_sn_arr=val
        },
        derive_all(){//批量导出批次
        	var self=this,num=0
        	for(let i=0;i<this.checkbox_arr.length;i++){
	        	this.ajax({
	        		url:'/device/batch/'+self.checkbox_arr[i].batch,
	        		mode:'get',
	        		data:{},
	        		success(res){
	        			num++
	        			for(let j=0;j<res.data.data.length;j++){
	        				res.data.data[j].StatusRecords = res.data.data[j].StatusRecords || []
	        				for(let x=0;x<res.data.data[j].StatusRecords.length;x++){
	        					res.data.data[j].StatusRecords[x].Time=self.TIME(res.data.data[j].StatusRecords[x].Time)
	        					res.data.data[j].StatusRecords[x]=res.data.data[j].StatusRecords[x].Status+','+res.data.data[j].StatusRecords[x].Comment+','+res.data.data[j].StatusRecords[x].Time
	        				}
	        				res.data.data[j].StatusRecords=res.data.data[j].StatusRecords.join('---')
	        			}
	        			if(num==self.checkbox_arr.length){
	        				let data = [{}]
						    for (let k in res.data.data[0]) {
						      data[0][k] = k
						    }
						    data = data.concat(res.data.data)
						    self.downloadExl(data, '菜单')
	        			}
	        		}
	        	})
        	}
        },
        derive(val) { // 点击导出按钮
        	var self=this
        	this.ajax({
        		url:'/device/batch/'+val.batch,
        		mode:'get',
        		data:{},
        		success(res){
        			for(let j=0;j<res.data.data.length;j++){
        				res.data.data[j].StatusRecords = res.data.data[j].StatusRecords || []
        				for(let x=0;x<res.data.data[j].StatusRecords.length;x++){
        					res.data.data[j].StatusRecords[x].Time=self.TIME(res.data.data[j].StatusRecords[x].Time)
        					res.data.data[j].StatusRecords[x]=res.data.data[j].StatusRecords[x].Status+','+res.data.data[j].StatusRecords[x].Comment+','+res.data.data[j].StatusRecords[x].Time
        				}
        				res.data.data[j].StatusRecords=res.data.data[j].StatusRecords.join('---')
        			}
        			let data = [{}]
				   for (let k in res.data.data[0]) {
				     data[0][k] = k
				   }
				   data = data.concat(res.data.data)
				   self.downloadExl(data, '菜单')
        		}
        	})
		},
		sn_export(){//批量导出sn
			var arr=this.checkbox_sn_arr.concat()
			for(let j=0;j<arr.length;j++){
				arr[j].StatusRecords = arr[j].StatusRecords || []
				for(let x=0;x<arr[j].StatusRecords.length;x++){
					arr[j].StatusRecords[x]=arr[j].StatusRecords[x].Status+','+arr[j].StatusRecords[x].Comment+','+arr[j].StatusRecords[x].Time
				}
				arr[j].StatusRecords=arr[j].StatusRecords.join('---')
			}
			let data = [{}]
		    for (let k in arr[0]) {
		      data[0][k] = k
		    }
		    data = data.concat(arr)
		    this.downloadExl(data, '菜单')
		},
		downloadExl: function (json, downName, type) {  // 导出到excel
		  let keyMap = [] // 获取键
		  for (let k in json[0]) {
		    keyMap.push(k)
		  }
		  let tmpdata = [] // 用来保存转换好的json
		  json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
		    v: v[k],
		    position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
		  }))).reduce((prev, next) => prev.concat(next)).forEach(function (v) {
		    tmpdata[v.position] = {
		      v: v.v
		    }
		  })
		  let outputPos = Object.keys(tmpdata)  // 设置区域,比如表格从A1到D10
		  let tmpWB = {
		    SheetNames: ['mySheet'], // 保存的表标题
		    Sheets: {
		      'mySheet': Object.assign({},
		        tmpdata, // 内容
		        {
		          '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
		        })
		    }
		  }
		  let tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
		    {bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary'} // 这里的数据是用来定义导出的格式类型
		  ))], {
		    type: ''
		  })  // 创建二进制对象写入转换好的字节流
		  var href = window.URL.createObjectURL(tmpDown)  // 创建对象超链接
		  var aDom = document.createElement("a");
		  aDom.download = 'sn.xlsx'  // 下载名称
		  aDom.href = href  // 绑定a标签
		  aDom.click()  // 模拟点击实现下载
		  setTimeout(function () {  // 延时释放
		    URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
		  }, 100)
		},
		s2ab: function (s) { // 字符串转字符流
		  var buf = new ArrayBuffer(s.length)
		  var view = new Uint8Array(buf)
		  for (var i = 0; i !== s.length; ++i) {
		    view[i] = s.charCodeAt(i) & 0xFF
		  }
		  return buf
		},
		page(val){//翻页
			console.log(val)
		},
		query_style_batch(data1){
			var arr=[]
			for(let i=0;i<data1.length;i++){
				if(this.search_batch_num==data1[i].batch){
					arr.push(data1[i])
				}
			}
			return arr
		},
		query_style_sn(data1){
			var arr=[]
			for(let i=0;i<data1.length;i++){
				if(this.search_firm_num==data1[i].ManufactNum){
					arr.push(data1[i])
				}
			}
			return arr
		},
		query_style_all(data1,data2){
			var arr=[]
			for(let i=0;i<data1.length;i++){
				if(this.search_firm_num==data1[i].ManufactNum && this.search_batch_num==data1[i].batch){
					arr.push(data1[i])
				}
			}
			return arr
		}
	},
    components:{
    },
}
</script>

<style scoped>
	.width80px{
		display: inline-block;
		width:80px;
		flex-shrink: 0
	}
	.senior{
		max-height: 0px;
		will-change:height;
		overflow-y: hidden;
		transition: max-height 0.5s;
		-moz-transition: max-height 0.5s;	/* Firefox 4 */
		-webkit-transition: max-height 0.5s;	/* Safari 和 Chrome */
		-o-transition: max-height 0.5s;	/* Opera */
	}
	.senior.senior-max-height{
		max-height:250px;
	}
	.margin0 button{
		margin:0px;
	}
</style>
