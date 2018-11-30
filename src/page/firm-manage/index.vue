<template>
  	<div class="">
  		<div class='flex jc-sb'>
  			<div class='flex'>
  				<el-input v-model="search_name" placeholder="厂商名称" class='search marginR20 width200'></el-input>
	  			<el-input v-model="search_num" placeholder="厂商编号" maxlength='2' class='search width200 marginR20'></el-input>
	  			<el-button type="primary" class='marginR20' @click='query'>查询</el-button>
	  			<el-button type="success" @click='add'>创建</el-button>
  			</div>
  			<div>
  				<!-- <el-button type="success" @click='add'>创建</el-button> -->
  			</div>
  		</div>
  		<el-table :data="firm_list" style="width: 100%" class='marginT20'>
	      <el-table-column type="index" width="50"> </el-table-column>
	      <el-table-column prop="ManufactureName" label="厂商名称"> </el-table-column>
	      <el-table-column prop="ManufactureNum" label="厂商编号"> </el-table-column>
	      <el-table-column prop="CreateTime" label="创建时间"> </el-table-column>
	      <el-table-column prop="city" label="地址"> </el-table-column>
	      <el-table-column prop="Phone" label="电话"> </el-table-column>
	      <el-table-column prop="Email" label="邮箱"> </el-table-column>
	      <el-table-column label="操作" width='180'>
	      	<template slot-scope="scope">
		        <el-button type="primary" @click='operate(scope.row,scope.$index)'>编辑</el-button>
		        <el-button type="primary" @click='del(scope.row,scope.$index)'>删除</el-button>
		    </template>
	      </el-table-column>
	    </el-table>

	    <!-- 创建编辑 -->
	    <div class='modal' v-if='modal'>
	    	<div class='modal-content'>
	    		<div class="center marginB20">
	    			{{edit_status ? "编辑厂商" : "创建厂商"}}
	    		</div>
	    		<div>
				  	<div class="flex al-ce">
				  		<span class='must width80px'>厂商名称</span>
				  		<el-input v-model="obj.name" placeholder="厂商名称" class=''></el-input>
				  	</div>
				  	<div class='marginT20 flex al-ce'>
				  		<span class='must width80px'>生成编号</span>
				  		<el-input v-model="obj.num" placeholder="输入两位大写字母" maxlength='2' :disabled='edit_status' @keyup.native='two'></el-input>
				  		<!-- <el-input  v-model="obj.num" placeholder="输入两位大写字母" maxlength='2' :disabled='edit_status' type="text" onKeyUp="if(this.value == ''){return false;}this.value = this.value.toUpperCase();if(!/^([A-Za-z]+\s?)*[A-Za-z]$/.test(this.value)){return this.value = this.value.substr(0, this.value.length - 1)}}"></el-input> -->
				  	</div>
				  	<div class='marginT20 flex al-ce'>
				  		<span class='must width80px'>对外编号</span>
				  		<el-input v-model="obj.foreign" placeholder="对外编号" class=''></el-input>

				  	</div>
					<div class='marginT20 flex'>
				  		<span class='must width80px height40'>地址</span>
				  		<p>
				  			<city @selectCity='selectCity' :sonCity='obj.city'></city>
				  			<el-input v-model="obj.city_det" placeholder="详细地址" class='marginT20'></el-input>
				  		</p>
				  	</div>
				  	<div class='marginT20 flex al-ce'>
				  		<span class=' width80px'>电话</span>
				  		<el-input v-model="obj.Phone" placeholder="电话" class=''></el-input>
				  	</div>
				  	<div class='marginT20 flex al-ce'>
				  		<span class=' width80px'>邮箱</span>
				  		<el-input v-model="obj.email" placeholder="邮箱" class=''></el-input>
				  	</div>
				  </div>
				  <div class="marginT20 center">
				    <el-button @click="modal = false">取 消</el-button>
				    <el-button type="primary" @click="sub">确 定</el-button>
				  </div>
	    	</div>
	    </div>
  	</div>
</template>

<script>
import city from '@/components/city';
export default {
	data () {
	    return {
	      	search_name:'',
	      	search_num:'',
	      	firm_list:[],//列表
	      	firm_list_s:[],//查询
	      	modal:false,
	      	province:'',
	      	city_s:'',
	      	area:'',
	      	obj:{name:'',num:'',city:[],city_det:'',email:'',foreign:'',Phone:''},
	      	edit_status:false,
	      	edit_index:-1
	    }
	},
	created(){
		this.vender_list()
		this.modal=this.$route.query.boo
	},
	methods: {
        operate(scope,index){//编辑
        	this.obj={name:scope.ManufactureName,num:scope.ManufactureNum,city:scope.city_props,city_det:scope.city_det,email:scope.Email,CreateTime:scope.CreateTime,Phone:scope.Phone,foreign:scope.ViewNum}
        	this.edit_status=true
        	this.edit_index=index
        	this.modal=true
        },
        del(obj,index){//删除
        	var self=this
        	this.$confirm('此操作将删除该厂商, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	var _this=this
	        	this.ajax({
	        		url:'/manufacturer/'+obj.ManufactureNum,
	        		mode:'delete',
	        		data:{},
	        		success(res){
	        			self.firm_list.splice(index,1)
	        			_this.$message({
				            type: 'success',
				            message: '删除成功!'
				        });
	        		}
	        	})
	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '已取消删除'
	          });          
	        });
        },
        selectCity(val){//三级联动地址传值
        	this.obj.city=val
        },
        add(){ //创建
        	this.obj={name:'',num:'',city:[],city_det:'',email:'',foreign:'',Phone:''}
        	this.edit_status=false
        	this.modal=true
        },
        sub(){//modal确定
        	var self=this
        	if(self.obj.name && self.obj.num && self.obj.city && self.obj.city_det){
        		this.ajax({
	        		url:'/manufacturer',
	        		mode:self.edit_status ? 'put' : 'post',
	        		data:{
	        			ManufactureName:self.obj.name,
						ManufactureNum:self.obj.num,
						Address:JSON.stringify(self.obj.city)+'+'+self.obj.city_det,
						Phone:self.obj.Phone,
						Email:self.obj.email,
						ViewNum:self.obj.foreign
	        		},
	        		success(res){
	        			res.data.data.CreateTime=self.TIME(res.data.data.CreateTime)
	    				var arr=JSON.parse(res.data.data.Address.split('+')[0])
	    				res.data.data.city=arr[0].val+arr[1].val+arr[2].val+res.data.data.Address.split('+')[1]
	    				res.data.data.city_det=res.data.data.Address.split('+')[1]
	    				res.data.data.city_props=arr
	        			if(self.edit_status)
	        				self.firm_list.splice(self.edit_index,1,res.data.data)
	        			else
		        			self.firm_list.unshift(res.data.data)
	        			self.modal=false
	        			self.$message({
			              message: '创建成功',
			              type: 'success'
			            });
	        		}
	        	})
        	}else{
        		this.$message({
		          message: '请完善表格信息',
		          type: 'warning'
		        });
        	}
        },
        query(){//查询
        	var arr=[]
        	if(this.search_name || this.search_num){
				if(this.search_name && !this.search_num){
					for(let i=0;i<this.firm_list_s.length;i++){
						if(this.firm_list_s[i].ManufactureName.indexOf(this.search_name)>-1){
							arr.push(this.firm_list_s[i]) //查询到的
						}
					}
				}else if(this.search_num && !this.search_name){
					for(let i=0;i<this.firm_list_s.length;i++){
						if(this.firm_list_s[i].ManufactureNum===this.search_num){
							arr.push(this.firm_list_s[i]) //查询到的
						}
					}
				}else{
					for(let i=0;i<this.firm_list_s.length;i++){
						if((this.firm_list_s[i].ManufactureNum===this.search_num) && (this.firm_list_s[i].ManufactureName.indexOf(this.search_name)>-1) ){
							arr.push(this.firm_list_s[i]) //查询到的
						}
					}
				}
				this.firm_list=[]
				this.firm_list=this.firm_list.concat(arr)
			}else{
				this.vender_list()
			}
        },
        vender_list(){
        	var self=this
        	this.ajax({
        		url:'/manufacturer',
        		mode:'get',
        		data:{},
        		success(res){
        			for(let i=0;i<res.data.data.length;i++){
        				res.data.data[i].CreateTime=self.TIME(res.data.data[i].CreateTime)
        				var arr=res.data.data[i].Address.split('+')[0]
        				res.data.data[i].city=arr[0] ? arr[0].val+arr[1].val+arr[2].val+res.data.data[i].Address.split('+')[1] : ''

        				res.data.data[i].city_det=res.data.data[i].Address.split('+')[1]
        				res.data.data[i].city_props=arr
        			}
        			self.firm_list=res.data.data
        			self.firm_list_s=res.data.data
        		}
        	})
        },
        two(){
        	var reg = /^[A-Z]+$/
        	var str = event.key.toUpperCase()
        	if(!reg.test(str)){
        		this.$set(this.obj,'num',event.key.substr(0, event.key.length - 1))
        		return false
        	}
        	this.$set(this.obj,'num',event.target.value.toUpperCase())
        }
	},
    components:{
        city
    },
}
</script>

<style scoped>
	.width80px{
		display: inline-block;
		width:80px;
		flex-shrink: 0
	}
</style>
