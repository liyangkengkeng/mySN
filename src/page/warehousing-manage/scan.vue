<template>
	<div>
		<div class="size18">
			<div class="center">
				<el-button :type="status==1 ? 'primary' : ''" class='maxSize size18' @click='status="1"'>扫码入库</el-button>
				<el-button :type="status==2 ? 'primary' : ''" class='maxSize size18' @click='status="2"'>扫码出库</el-button>
				<el-button :type="status==3 ? 'primary' : ''" class='maxSize size18' @click='status="3"'>扫码维修</el-button>
			</div>
			
		</div>
		<div class="flex marginT40">
			<div class="marginR40 width508">
				<div class="radio">
					<template v-if='status==1'>
						<label class="size18 marginR40"><input type="radio" name="" value='1' v-model='radio1'>&nbsp;入库操作</label>
		  				<label class="size18"><input type="radio" name="" value='0' v-model='radio1'>&nbsp;清除入库</label>
					</template>
					<template v-else-if='status==2'>
						<label class="size18 marginR40"><input type="radio" name="" value='1' v-model='radio2'>&nbsp;出库操作</label>
		  				<label class="size18"><input type="radio" name="" value='0' v-model='radio2'>&nbsp;还原</label>
					</template>
					<template v-else>
						<label class="size18 marginR40"><input type="radio" name="" value='1' v-model='radio3'>&nbsp;设备维修</label>
		  				<label class="size18"><input type="radio" name="" value='0' v-model='radio3'>&nbsp;设备维修完成</label>
					</template>
				</div>
				<div class="flex marginT20">
					<div class='height54'>
						<span>SN：&emsp;</span>	
					</div>
					<div>
						<p class="flex al-ce marginB10">
							<input type="" name="" class="height54 size18 marginR20 scan" id="input" v-model="concat" @keyup.enter='warehousing'>
							<el-button type="primary" @click='warehousing'>确认<br>（点击/回车）</el-button>
						</p>
						<p>
							型号：{{device_details.ProductType}} <br>厂商：{{device_details.ManufactNum}}<br>更新时间：{{device_details.UpdateTime}}
						</p>
					</div>
				</div>
			</div>
			<div class="width100">
				<div class="size18 marginB20">
					今日入库：{{device_list.length}}
				</div>
				<el-table :data="device_list" style="width: 100%">
			      <el-table-column type="index" width="50"> </el-table-column>
			      <el-table-column prop='batch' label="SN好"></el-table-column>
			      <el-table-column label="状态"> 
					<template slot-scope='scope'>
						<el-button type="primary" size="mini" v-for='(val,key) in scope.row.StatusMap' :key='key'>{{key}}:{{val}}</el-button>
					</template>
			      </el-table-column>

			      <el-table-column prop="UpdateTime" label="更新时间"> </el-table-column>
			      <el-table-column prop="CreateTime" label="入库时间"> </el-table-column>
				  <el-table-column prop="CreateTime" label="出库时间"> </el-table-column>
				  <el-table-column prop="CreateTime" label="批次号"> </el-table-column>
				  <el-table-column prop="CreateTime" label="产品型号"> </el-table-column>


			      <el-table-column prop="ManufactNum" label="厂商编号"> </el-table-column>
			      <el-table-column prop="name" label="厂商名称"> </el-table-column>
				  
			    </el-table>
			</div>
		</div>
	</div>
	
</template>
<script>
	export default {
		data () {
		    return {
		      	radio1:'1',//入库
		      	radio2:'1',//出库
		      	radio3:'1',//维修
		      	concat:'',//扫码内容
		      	status:1,//tabs切换
		      	device_list:[],//设备列表
		      	device_details:{},//设备详情
		    }
		},
		created(){

		},
		mounted(){
			this.$nextTick(()=>{
				document.getElementById('input').focus()
			})
		},
		methods: {
			warehousing(){
				if(this.concat){
					var self=this
					var arr=[],radio=true
					arr[0]={}
					arr[0].SN=this.concat
					if(this.status==1){
						if(this.raido1=='1'){
							arr[0].Status='warehousing',arr[0].Comment='入库'
						}else{
							arr[0].Status='warehousing',arr[0].Comment='清除入库'
							radio=false
						}
					}
					else if(this.status==2){
						if(this.raido1=='1'){
							arr[0].Status='export',arr[0].Comment='出库'
						}else{
							arr[0].Status='export',arr[0].Comment='清除出库'
							radio=false
						}
					}
					else{
						if(this.raido1=='1'){
							arr[0].Status='repair',arr[0].Comment='维修'
						}else{
							arr[0].Status='repair',arr[0].Comment='维修完成'
							radio=false
						}
					}
					this.ajax({
						url:'/device/status',
		        		mode:radio ? 'post' : 'delete',
		        		data:arr,
		        		success(res){
							self.device_list.push(self.device_details)
							self.concat=''
							self.device_details={}
		        		}
					})
				}else{
					this.$message.error('请扫描或输入SN码');
					document.getElementById('input').focus()
				}
			}
		},
		watch:{
			concat(val){
				var self=this
				if(val.length==12){
					this.ajax({
						url:'/device/exactsn/'+val,
						mode:'get',
						data:{},
						success(res){
							res.data.data.UpdateTime=self.TIME(res.data.data.UpdateTime)
							res.data.data.CreateTime=self.TIME(res.data.data.CreateTime)
							res.data.data.batch = res.data.data.TimeNum + (res.data.data.BatchNum<10 ? '00'+res.data.data.BatchNum : '0'+res.data.data.BatchNum)
							self.device_details=res.data.data
						}
					})
				}
			}
		},
	    components:{
	      
	    },
	}
</script>
<style scoped>
	.maxSize{
		width: 200px;height: 48px;
	}
	.height54{
		height: 54px;line-height: 54px;
	}
	.scan{
		width: 290px;border: 1px solid #d9d9d9;padding-left: 10px;
	}
	.width508{
		width: 508px;flex-shrink: 0
	}
</style>