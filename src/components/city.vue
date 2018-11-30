<template>
  <div class="linkage">
    <el-select
      v-model="sheng"
      @change="choseProvince"
      placeholder="省级地区">
      <el-option
        v-for="item in province"
        :key="item.id"
        :label="item.value"
        :value="item.id">
      </el-option>
    </el-select>
    <el-select
      v-model="shi"
      @change="choseCity"
      placeholder="市级地区">
      <el-option
        v-for="item in shi1"
        :key="item.id"
        :label="item.value"
        :value="item.id">
      </el-option>
    </el-select>
    <el-select
      v-model="qu"
      @change="choseBlock"
      placeholder="区级地区">
      <el-option
        v-for="item in qu1"
        :key="item.id"
        :label="item.value"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props:{
      sonCity:{
        type: Array,
        default() {
            return []
        }
      },
  },
  data () {
    return {
      mapJson:'../../static/city.json',
      province:'',
      sheng: '',
      shi: '',
      shi1: [],
      qu: '',
      qu1: [],
      city:'',
      block:'',
      deliver1:{},
      deliver2:{},
      deliver3:{},
    }
  },
  methods:{
    // 加载china地点数据，三级
      getCityData:function(){
        var that = this
        this.axios.get(this.mapJson).then(function(response){
          if (response.status==200) {
            var data = response.data
            that.province = []
            that.city = []
            that.block = []
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {//省
                that.province.push({id: item, value: data[item], children: []})
              } else if (item.match(/00$/)) {//市
                that.city.push({id: item, value: data[item], children: []})
              } else {//区
                that.block.push({id: item, value: data[item]})
              }
            }
            // 分类市级
            for (var index in that.province) {
              for (var index1 in that.city) {
                if (that.province[index].id.slice(0, 2) === that.city[index1].id.slice(0, 2)) {
                  that.province[index].children.push(that.city[index1])
                }
              }
            }
            // 分类区级
            for(var item1 in that.city) {
              for(var item2 in that.block) {
                if (that.block[item2].id.slice(0, 4) === that.city[item1].id.slice(0, 4)) {
                  that.city[item1].children.push(that.block[item2])
                }
              }
            }

            if(that.sonCity.length>0){
              that.sheng=that.sonCity[0].val
              that.shi=that.sonCity[1].val
              that.qu=that.sonCity[2].val
            }


          }
          else{
            console.log(response.status)
          }
        }).catch(function(error){console.log(typeof+ error)})
      },
      // 选省
      choseProvince:function(e) {
        for (var index2 in this.province) {
          if (e === this.province[index2].id) {
            this.sheng=this.province[index2].value
            this.shi1 = this.province[index2].children
            this.shi = this.province[index2].children[0].value
            this.qu1 =this.province[index2].children[0].children
            this.qu = this.province[index2].children[0].children[0].value
            this.E = this.qu1[0].id

            this.deliver1={key:this.province[index2].id,val:this.province[index2].value}
            this.deliver2={key:this.province[index2].children[0].id,val:this.province[index2].children[0].value}
            this.deliver3={key:this.province[index2].children[0].children[0].id,val:this.province[index2].children[0].children[0].value}
          }
        }
        this.$emit('selectCity',[this.deliver1,this.deliver2,this.deliver3])
      },
      // 选市
      choseCity:function(e) {
        for (var index3 in this.city) {
          if (e === this.city[index3].id) {
            this.qu1 = this.city[index3].children
            this.qu = this.city[index3].children[0].value
            this.E = this.qu1[0].id
            this.deliver2={key:this.province[index3].children[0].id,val:this.province[index3].children[0].value}
          }
        }
        this.$emit('selectCity',[this.deliver1,this.deliver2,this.deliver3])
      },
      // 选区
      choseBlock:function(e) {
        this.E=e;
        for(var index4 in this.qu1){
          if (e === this.qu1[index4].id) {
            this.deliver3={key:this.qu1[index4].id,val:this.qu1[index4].value}
          }
        }
        this.$emit('selectCity',[this.deliver1,this.deliver2,this.deliver3])
      },
    },
  created:function(){
    this.getCityData()
  }
}
</script>

<style scoped>

</style>
