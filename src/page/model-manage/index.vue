<template>
  	<div class="">
  		<div class='flex jc-sb'>
  			<div class='flex'>
  				<el-input v-model="search_num" placeholder="产品编号" class='search marginR20 width200'></el-input>
	  			<el-select v-model="type" placeholder="产品类型" class='marginR20'>
				    <el-option
				      v-for="item in type_list"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				</el-select>
				<el-select v-model="status" placeholder="产品状态" class='marginR20'>
				    <el-option
				      v-for="item in statuss"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				</el-select>
	  			<el-button type="primary" @click='query'>查询</el-button>
	  			<el-button type="success" @click='add'>创建</el-button>
  			</div>
  			<div>
  				<!-- <el-button type="success" @click='add'>创建</el-button> -->
  			</div>
  		</div>
  		<el-table :data="model_list" style="width: 100%" class='marginT20'>
	      <el-table-column type="index" width="50"> </el-table-column>
	      <el-table-column prop="ProductNum" label="产品型号"> </el-table-column>
	      <el-table-column prop="ProductType" label="产品类型"> </el-table-column>
	      <el-table-column prop="CreateTime" label="创建时间"> </el-table-column>
	      <el-table-column prop="SNCount" label="关联SN"> </el-table-column>
	      <el-table-column prop="ProductStatus" label="状态"> </el-table-column>
	      <el-table-column label="操作">
	      	<template slot-scope="scope">
		        <el-button type="primary" @click='operate(scope.row,scope.$index)'>编辑</el-button>
		        <el-button type="success" @click='close(scope.row,scope.$index)'>删除</el-button>
		    </template>
	      </el-table-column>
	    </el-table>

	    <!-- 创建编辑 -->
	    <div class='modal' v-if='modal'>
	    	<div class='modal-content'>
	    		<div class="center marginB20">
	    			{{edit_status ? '编辑产品' : '创建产品'}}
	    		</div>
	    		<div>
	    			<div class='marginT20 flex al-ce'>
				  		<span class='must width80px must'>产品类型</span>
				  		<!-- <el-input v-model="obj.type" placeholder="DTU" class=''></el-input> -->
				  		<el-select v-model="obj.type" placeholder="产品状态" class='width100'>
						    <el-option
						      v-for="item in type_list"
						      :key="item"
						      :label="item"
						      :value="item">
						    </el-option>
						</el-select>
				  	</div>
				  	<div class="flex al-ce marginT20">
				  		<span class='must width80px must'>产品型号</span>
				  		<el-input v-model="obj.num" placeholder="编号" class=''></el-input>
				  	</div>
				  </div>
				  <div class="marginT20 center">
				    <el-button @click="modal = false , edit_status=false">取 消</el-button>
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
	      	search_num:'',
	      	type:'',//产品类型
	      	// types:['A','B','C'],
	      	status:'',//产品状态
	      	statuss:['a','b','c'],
	      	modal:false,
	      	model_list:[],
	      	model_list_copy:[],
	      	obj:{num:'',type:[],time:'',sn:'',status:'',id:''},
	      	type_list:['成品','DTU','SU'],
	      	edit_status:false,
	      	edit_CreateTime:'',
	      	edit_index:null,
		}
	},
	created(){
		this.model_list_copy=this.model_list
		this.modal=this.$route.query.boo
		this.model_ajax()
	},
	methods: {
		model_ajax(){
			var self=this
			this.ajax({
        		url:'/product',
          		mode:'get',
          		data:{},
          		success(res){
          			for(let i=0;i<res.data.data.length;i++){
          				res.data.data[i].CreateTime=self.TIME(res.data.data[i].CreateTime)
          			}
		            self.model_list=res.data.data
		            self.model_list_copy=self.model_list
          		}
        	})
		},
        operate(scope,index){//编辑
        	this.$set(this.obj,'num',scope.ProductNum)
        	this.$set(this.obj,'type',scope.ProductType)
        	this.edit_CreateTime=scope.CreateTime
        	this.obj.id=scope.id
        	this.edit_index=index
        	this.modal=true
        	this.edit_status=true
        },
        close(scope,index){//关闭
        	var self=this
        	this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	var _this=this
	        	this.ajax({
	        		url:'/product/'+scope.ProductNum,
	        		mode:'delete',
	        		data:{},
	        		success(res){
	        			self.model_list.splice(index,1)
		            	self.model_list_copy=self.model_list
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
        	this.obj={num:'',type:[]},
        	this.modal=true
        },
        sub(){//modal确定
        	var self=this,obj={}
        	if(self.edit_status){
        		obj.ProductNum=self.obj.num
	          	obj.ProductType=self.obj.type
	        	obj.id=self.obj.id
        	}else{
        		obj.ProductNum=self.obj.num
	          	obj.ProductType=self.obj.type
        	}
        	if(self.obj.type.length && self.obj.num){
        		this.ajax({
	        		url:'/product',
	          		mode:self.edit_status ? 'put' : 'post',
	          		data:obj,
	          		success(res){
	          			self.$message({
			              message: '创建成功',
			              type: 'success'
			            });
			            res.data.data.CreateTime=self.TIME(res.data.data.CreateTime)
			            if(self.edit_status){
			            	self.model_list.splice(self.edit_index,1,res.data.data)
			            }
			            else{
			            	self.model_list.unshift(res.data.data)
			            }
		        		
		        		self.modal=false
		        		self.edit_status=false
	          		}
	        	})
        	}else{
        		this.$message({
		          message: '请完善表格信息',
		          type: 'warning'
		        });
        	}
        	
        },
        query(){//搜索
        	var obj={},arr=[]
        	if(this.search_num)
        		obj.ProductNum=this.search_num
        	if(this.type)
        		obj.ProductType=this.type
        	if(this.status)
        		obj.ProductStatus=this.status

        	for(let i=0;i<this.model_list_copy.length;i++){
        		var flag=true
        		for(let key in obj){
        			if(obj[key] != this.model_list_copy[i][key]){
        				flag=false
        			}
        		}
        		if(flag){
        			arr.push(this.model_list_copy[i])
        		}
        	}
        	this.model_list=[]
        	this.model_list=this.model_list.concat(arr)

        },
        selectCity(val){//三级联动地址传值
        	this.obj.city=val
        },
        handleChange(val){
        	console.log(this.obj)
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
	.modal-content{
		width: 682px;
	}
</style>
