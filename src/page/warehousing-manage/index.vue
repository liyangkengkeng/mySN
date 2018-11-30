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
  				<el-button type="success" @click='batch_wait'>批量入库</el-button>
  				<el-button type="primary" @click='batch_already'>批量出库</el-button>
  				<el-button type="" @click='batch_revert'>批量返修</el-button>
  			</div>
  		</div>
		
		<div class="marginT20 tabs">
			<el-button :type="tabs=='wait' ? 'primary' : ''" @click='tabs="wait"'>待入库</el-button>
			<el-button :type="tabs=='already' ? 'primary' : ''" @click='tabs="already"'>已入库</el-button>
			<el-button :type="tabs=='leave' ? 'primary' : ''" @click='tabs="leave"'>已出库</el-button>
			<el-button :type="tabs=='revert' ? 'primary' : ''" @click='tabs="revert"'>返修</el-button>
		</div>
  		<el-table :data="snList" style="width: 100%" class='' @selection-change="handleSelectionChange">
  		  <el-table-column type="selection" width="55"> </el-table-column>
	      <el-table-column type="index" width="50"> </el-table-column>
	      <el-table-column prop="SN" label="设备SN"> </el-table-column>
	      <el-table-column prop="batch" label="批次号"> </el-table-column>
	      <el-table-column label="状态" width='250'> 
			<template slot-scope='scope'>
				<el-button type="primary" size="mini" v-for='(val,index) in scope.row.StatusRecords' :key='val.Status'>
					{{val.Status}}<br>
					{{val.Time}}<br>
					{{val.Comment}}
				</el-button>
			</template>
	      </el-table-column>

	      <template v-if="tabs=='wait'">
	      	<el-table-column prop="UpdateTime" label="更新时间" width='250'> </el-table-column>
	      </template>
	      <template v-else-if="tabs=='already'">
	      	<el-table-column prop="CreateTime" label="入库时间" width='250'> </el-table-column>
	      </template>
	      <template v-else-if="tabs=='leave'">
	      	<el-table-column prop="CreateTime" label="出库时间" width='250'> </el-table-column>
	      </template>
	      <template v-else-if="tabs=='revert'">
	      	<el-table-column prop="CreateTime" label="返修时间" width='250'> </el-table-column>
	      </template>
	      
	      <el-table-column prop="ProductNum" label="产品型号" width='250'> </el-table-column>
	      <el-table-column prop="ManufactNum" label="厂商编号"> </el-table-column>
	      <!-- <el-table-column prop="name" label="厂商名称"> </el-table-column> -->
			
	      <el-table-column label="操作" width='200'>
	      	<template slot-scope="scope">
	      		<router-link class='btn' :to='{path:"/details",query:{obj:JSON.stringify(scope.row)}}'>详情</router-link>
		        <!-- <el-button type="primary" size="mini" @click='detailes(scope.row)'>详情</el-button> -->
		    </template>
	      </el-table-column>
	    </el-table>
  	</div>
</template>

<script>
export default {
	data () {
	    return {
	    	search_batch_num:'',
	    	search_firm_num:'',
	    	found_time:'',//创建时间
	    	update_time:'',//更新时间
	    	search_did:'',//did查询
	    	search_key:'',//key查询,
	    	type_list:['类型1','类型2','类型3','类型4','类型5','类型6',],//产品类型
	    	current_type:'',//选中的产品类型
	    	activate:'',//激活
	    	device_status:'',//设备状态
	    	device_status_arr:['状态1','状态2','状态3','状态4','状态5',],
	    	list:[{batch:'批次号1',quantity:'10个',status:['状态1','状态2','状态3'],build_time:'2011-11-11 11:11:11',update_time:'2011-11-11 11:11:11',identifier:'4ds5a4d',name:'名字1',derive:'2'}],
	    	height:false,
	    	tabs:'wait',//状态切换
	    	checkbox_arr:[],//选中状态
	    	snList:[],//设备列表
	    	wait:[],//待入库
	    	already_entered:[],//已经入库
	    	get_out:[],//已经出库
	    	repair:[],//返修
	    }
	},
	created(){
		this.current_type=localStorage.getItem('current_type') || ''
		this.sn_list()
	},
	methods: {
		sn_list(){//设备列表
			var self=this
			self.snList=[]
			self.wait=[]
			self.already_entered=[]
			self.get_out=[]
			self.repair=[]
			this.ajax({
        		url:'/device',
        		mode:'get',
        		data:{},
        		success(res){
        			for(let i=0;i<res.data.data.length;i++){
    					res.data.data[i].batch = res.data.data[i].TimeNum + (res.data.data[i].BatchNum<10 ? '00'+res.data.data[i].BatchNum : '0'+res.data.data[i].BatchNum)
        				res.data.data[i].CreateTime=res.data.data[i].CreateTime ? self.TIME(res.data.data[i].CreateTime) : 0
        				res.data.data[i].UpdateTime=res.data.data[i].UpdateTime ? self.TIME(res.data.data[i].UpdateTime) : 0
        				// console.log(res.data.data[i].StatusRecords.length)
        				if(res.data.data[i].StatusRecords && res.data.data[i].StatusRecords.length>0){
        					for(let j=0;j<res.data.data[i].StatusRecords.length;j++){
	        					res.data.data[i].StatusRecords[j].Time=self.TIME(res.data.data[i].StatusRecords[j].Time)
	        				}
        				}
        				if(i<11){
        					self.wait.push(res.data.data[i])
        					self.snList.push(res.data.data[i])
        				}
        				if(i<21 && i>10){
        					self.already_entered.push(res.data.data[i])
        				}
        				if(i<31 && i>20){
        					self.get_out.push(res.data.data[i])
        				}
        				if(i<41 && i>30){
        					self.repair.push(res.data.data[i])
        				}
        			}
        		}
        	})
		},
       query(){//查询

       },
       add(){

       },
       handleSelectionChange(val){//多选框批量处理
       		console.log(val)
       		this.checkbox_arr=val
       },
       batch_wait(){//批量入库

       },
       batch_already(){//批量出库

       },
       batch_revert(){//批量返修

       },

	},
	watch:{
		tabs(val){
			this.snList=[]
			if(val=='wait')
				this.snList=this.snList.concat(this.wait)
			else if(val=='already')
				this.snList=this.snList.concat(this.already_entered)
			else if(val=='leave')
				this.snList=this.snList.concat(this.repair)
			else if(val=='revert')
				this.snList=this.snList.concat(this.repair)
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
	.tabs button{
		margin:0px;
	}
</style>
