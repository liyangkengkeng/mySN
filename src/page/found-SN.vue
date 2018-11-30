<template>
  <div>
  	<p class="marginB20"><span>SN信息</span></p>
  	<p class="marginB20"><span>编号范围</span></p>
  	<p class="marginB20 flex al-ce"><span class='width90 size14'>序号开始</span><span>1</span></p>
  	<p class="marginB20 flex al-ce">
  		<span class='width90 size14 must'>序号结束</span>
  		<!-- <el-input-number class='width200 marginR20' v-model="end" :min="1" :precision="1" :max="1000000" label="结束序号"></el-input-number> -->
  		<el-input class='width200 marginR20' v-model="end" placeholder="结束序号" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"></el-input>
  		<span class="size14">生成批次SN数量：{{end}}个</span>
  	</p>
  	<p class="marginB20"><span>SN属性</span></p>
  	<p class="marginB20">
  		<span  class='width90 size14 must'>选择厂商</span>
  		<el-select v-model="value" placeholder="选择厂商">
		    <el-option
		      v-for="item in options"
		      :key="item.ManufactureName"
		      :label="item.ManufactureName"
		      :value="item.ManufactureNum">
		    </el-option>
		</el-select>
		<router-link :to='{path:"/firm-manage",query:{boo:true}}' class='btn'>创建厂商</router-link>
  	</p>
  	<p class="marginB20">
  		<span  class='width90 size14 must'>选择型号</span>
  		<el-select v-model="styles" placeholder="选择产品类型">
		    <el-option
		      v-for="item in style_list"
		      :key="item"
		      :label="item"
		      :value="item">
		    </el-option>
		</el-select>
    <!-- <el-input v-model="model" placeholder="输入产品型号" class='width200'></el-input> -->
    <el-select v-model="model" placeholder="选择产品类型">
        <el-option
          v-for="item in model_list"
          :key="item.ProductNum"
          :label="item.ProductNum"
          :value="item.ProductNum">
        </el-option>
    </el-select>
		<router-link :to='{path:"/model-manage",query:{boo:true}}' class='btn'>创建型号</router-link>
  	</p>
  	<p><el-button type="primary" @click='add'>立即生成</el-button></p>
  </div>
</template>

<script>
export default {
  data () {
    return {
    	start:'',
    	end:1,
      value:'',//厂商
      model:'',//型号
      styles:'',//类型
      options:[],
      style_list:['成品','DTU','SU'],
      model_list:[],
    }
  },
  created(){
    this.vender_list()
  },
  methods:{
    vender_list(){
      var self=this
      this.ajax({
        url:'/manufacturer',
        mode:'get',
        data:{},
        success(res){
          self.options=res.data.data
        }
      })
    },
    add(){
      if(this.model && this.styles && this.end && this.value){
        var self=this
        var myDate = new Date();
        var year = myDate.getYear()<2000 ? myDate.getYear()+1900 : myDate.getYear() 
        var yy=year.toString().substr(2, 2); 
        var time=yy+(myDate.getMonth()<9 ? '0'+(myDate.getMonth()+1) : myDate.getMonth()+1)+(myDate.getDate()<9 ? '0' +myDate.getDate() : myDate.getDate())
        this.ajax({
          url:'/device',
          mode:'post',
          data:{
            ProductNum:self.model,
            ProductType:self.styles,
            count:Number(self.end),
            ManufactNum:self.value,
            TimeNum:time
          },
          success(res){
            self.options=res.data.data
            self.$message({
              message: '创建成功',
              type: 'success'
            });
            self.$router.push('/sn-manage')
            // self.model=''
            // self.styles='' 
            // self.end=''  
            // self.value=''
          }
        })
      }else{
        this.$message({
          message: '请完善表格信息',
          type: 'warning'
        });
      }
    }
  },
  watch:{
    styles(val){
      var self=this
      this.ajax({
        url:'/product/type/'+val,
        mode:'get',
        data:{},
        success(res){
          self.model_list=res.data.data
        }
      })
    }
  }
}
</script>

<style scoped>
	.width90{
		display: inline-block;
		width: 90px;
	}
</style>
