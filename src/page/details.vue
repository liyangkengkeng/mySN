<template>
	<div>
		<div class="flex jc-sb">
			<div class="flex">
				<p class="marginR20 height40 background colorF paddingLR20">SN:{{sn_details[0].SN}}</p>
				<p class="height40 background colorF paddingLR20">批次号：{{sn_details[0].batch}}</p>
			</div>
			<div class="flex">
				<p class="marginR20 height40 background colorF paddingLR20">已烧录</p>
				<p class="height40 background colorF paddingLR20">已激活</p>
			</div>
		</div>
		<div class="marginT20">
			<div class="height48 flex al-ce marginB20 background colorF paddingLR20">
				SN信息
			</div>
			<el-table :data="sn_details" style="width: 100%">
		      <el-table-column prop="SN" label="SN"> </el-table-column>
		      <el-table-column prop="batch" label="批次号"> </el-table-column>
		      <el-table-column prop="KEY" label="KEY"> </el-table-column>
		      <el-table-column prop="DID" label="DID"> </el-table-column>
		      <el-table-column prop="ProductType" label="产品类型"> </el-table-column>
		      <el-table-column prop="ProductNum" label="产品型号"> </el-table-column>
		      <el-table-column prop="CreateTime" label="生成时间"> </el-table-column>
		      <el-table-column prop="burn_time" label="烧写时间"> </el-table-column>
		      <el-table-column prop="activation_time" label="激活时间"> </el-table-column>
		      <el-table-column prop="repair" label="返修"> </el-table-column>
		      <el-table-column prop="service" label="维修"> </el-table-column>
		      <el-table-column prop="scrap" label="报废"> </el-table-column>
		    </el-table>
		</div>
		<div class="marginT20">
			<div class="height48 flex al-ce marginB20 background colorF paddingLR20">
				厂商信息
			</div>
			<el-table :data="seller_list" style="width: 100%">
		      <el-table-column prop="ManufactureName" label="厂商名称"> </el-table-column>
		      <el-table-column prop="Phone" label="厂商电话"> </el-table-column>
		      <el-table-column prop="Email" label="邮箱"> </el-table-column>
		    </el-table>
		</div>
		<div class="marginT20">
			<div class="height48 flex al-ce marginB20 background colorF paddingLR20 flex jc-sb">
				<span>维修信息</span>
				<!-- <el-button size='mini' @click='confirmation_sheet=true,modal_data="seller"'>维修</el-button> -->
			</div>
			<el-table :data="seller_list" style="width: 100%">
		      <el-table-column prop="status" label="状态"> </el-table-column>
		      <el-table-column prop="time" label="时间"> </el-table-column>
		      <el-table-column prop="remarks" label="备注"> </el-table-column>
		      <el-table-column prop="operation" label="操作"> </el-table-column>
		    </el-table>
		</div>
		<div class="marginT20">
			<div class="height48 flex al-ce marginB20 background colorF paddingLR20 flex jc-sb">
				<span>返修信息</span>
				<!-- <el-button size='mini' @click='confirmation_sheet=true,modal_data="repair"'>返修</el-button> -->
			</div>
			<el-table :data="repair_list" style="width: 100%">
		      <el-table-column prop="status" label="状态"> </el-table-column>
		      <el-table-column prop="time" label="时间"> </el-table-column>
		      <el-table-column prop="remarks" label="返修备注"> </el-table-column>
		      <el-table-column prop="operation" label="操作"> </el-table-column>
		    </el-table>
		</div>

		<div class="marginT20">
			<div class="height48 flex al-ce marginB20 background colorF paddingLR20 flex jc-sb">
				<span>报废信息</span>
				<!-- <el-button size='mini' @click='confirmation_sheet=true,modal_data="scrap"'>维修</el-button> -->
			</div>
			<el-table :data="scrap_list" style="width: 100%">
		      <el-table-column prop="status" label="状态"> </el-table-column>
		      <el-table-column prop="time" label="时间"> </el-table-column>
		      <el-table-column prop="remarks" label="备注"> </el-table-column>
		      <el-table-column prop="operation" label="操作"> </el-table-column>
		    </el-table>
		</div>
		<div class="marginT20">
			<div class="height48 flex al-ce marginB20 background colorF paddingLR20 flex jc-sb">
				<span>出入库信息</span>
				<!-- <p>
					<el-button size='mini' @click='confirmation_sheet=true,modal_data="downline"'>下产线</el-button>
					<el-button size='mini' @click='confirmation_sheet=true,modal_data="warehousing"'>入库</el-button>
					<el-button size='mini' @click='confirmation_sheet=true,modal_data="placing"'>出库</el-button>
				</p> -->
			</div>
			<el-table :data="record_list" style="width: 100%">
		      <el-table-column prop="status" label="状态"> </el-table-column>
		      <el-table-column prop="time" label="时间"> </el-table-column>
		      <el-table-column prop="remarks" label="备注"> </el-table-column>
		    </el-table>
		</div>

		<!-- 弹框 -->
		<div class='modal' v-if='confirmation_sheet'>
			<div class="confirmation-sheet">
				<p class="height48 flex al-ce background colorF paddingLR20 flex jc-sb">维修确认</p>
				<div class='modal-content'>
					<p class="center bold">
						<template v-if='modal_data=="seller"'>是否确认设备维修</template>
						<template v-if='modal_data=="repair"'>是否确认该设备维修完成</template>
						<template v-if='modal_data=="scrap"'></template>
						<template v-if='modal_data=="downline"'>设备下产线操作确认</template>
						<template v-if='modal_data=="warehousing"'>设备出库操作确认</template>
						<template v-if='modal_data=="placing"'>设备入库操作确认</template>
					</p>
					<p>
						<textarea name="" class="modal-textarea" maxlength="200" placeholder="请输入200字以内的备注"></textarea>
					</p>
					<p class="flex al-ce jc-ce">
						<el-button size='mini' @click='confirmation_sheet=false,modal_data=""'>取消</el-button><el-button size='mini'>确认</el-button>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data () {
	    return {
	    	sn_details:[],
	    	seller_list:[],//维修信息
	    	repair_list:[],//返修信息
	    	scrap_list:[],//报废信息
	    	record_list:[],//出入库信息
	    	confirmation_sheet:false,//弹框
	    	modal_data:'',
	    }
	},
	created(){
		this.sn_details[0]=JSON.parse(this.$route.query.obj)
		this.manufacturer_details(this.sn_details[0].ManufactNum)
	},
	methods: {
       manufacturer_details(num){
       	var self=this
       	self.seller_list=[]
   		this.ajax({
   			url:'/manufacturer/'+num,
    		mode:'get',
    		data:{},
    		success(res){
    			self.seller_list.push(res.data.data)
    		}
   		})
       }

	},
    components:{
    },
}
</script>
<style scoped>
	.height40{
		height: 40px;line-height: 40px;
	}
	.height48{
		height: 48px
	}
	.confirmation-sheet{
		/*width: 500px*/
	}
	.modal-textarea{
		width: 500px;
		height: 150px;
		margin:30px 0px;
		padding:10px;
		resize:none
	}
</style>