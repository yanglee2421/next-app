<script setup lang="ts">
const aviationPlug19core = [
  { plugSeat: "1", toProgrammable: "X26", controlObject: "RD2" },
  { plugSeat: "2", toProgrammable: "X27", controlObject: "RE2" },
  { plugSeat: "3", toProgrammable: "X14", controlObject: "泵启" },
  { plugSeat: "4", toProgrammable: "X0", controlObject: "总停" },
  { plugSeat: "5", toProgrammable: "X1", controlObject: "自动" },
  { plugSeat: "6", toProgrammable: "X2", controlObject: "手动" },
  { plugSeat: "7", toProgrammable: "X4", controlObject: "推轮" },
  { plugSeat: "8", toProgrammable: "X3", controlObject: "复位" },
  { plugSeat: "9", toProgrammable: "X5", controlObject: "探头移动" },
  { plugSeat: "10", toProgrammable: "X7", controlObject: "轮对反转" },
  { plugSeat: "11", toProgrammable: "X6", controlObject: "轮对正转" },
  { plugSeat: "12", toProgrammable: "COM", controlObject: "信号公共线" },
  { plugSeat: "13", toProgrammable: "", controlObject: "" },
  { plugSeat: "14", toProgrammable: "", controlObject: "" },
  { plugSeat: "15", toProgrammable: "+24V", controlObject: "+24V电源" },
  { plugSeat: "16", toProgrammable: "", controlObject: "" },
  { plugSeat: "17", toProgrammable: "TD", controlObject: "PLC串口" },
  { plugSeat: "18", toProgrammable: "RD", controlObject: "PLC串口" },
  { plugSeat: "19", toProgrammable: "GND", controlObject: "PLC串口" },
];

const h32core = [
  { plugSeat: "1", toProgrammable: "Y2", controlObject: "左量轮径降" },
  { plugSeat: "2", toProgrammable: "Y6", controlObject: "左量轮径升" },
  { plugSeat: "3", toProgrammable: "Y3", controlObject: "右量轮径降" },
  { plugSeat: "4", toProgrammable: "Y7", controlObject: "右量轮径升" },
  { plugSeat: "5", toProgrammable: "Y16", controlObject: "左端机构升" },
  { plugSeat: "6", toProgrammable: "Y17", controlObject: "右端机构升" },
  { plugSeat: "7", toProgrammable: "Y24", controlObject: "左右机构降" },
  { plugSeat: "8", toProgrammable: "Y4", controlObject: "左端面探头进" },
  { plugSeat: "9", toProgrammable: "Y5", controlObject: "右端面探头进" },
  { plugSeat: "10", toProgrammable: "Y23", controlObject: "左右端面探头退" },
  { plugSeat: "11", toProgrammable: "", controlObject: "" },
  { plugSeat: "12", toProgrammable: "Y14", controlObject: "轴身左探头升" },
  { plugSeat: "13", toProgrammable: "", controlObject: "" },
  { plugSeat: "14", toProgrammable: "", controlObject: "" },
  { plugSeat: "15", toProgrammable: "Y15", controlObject: "轴身右探头升" },
  { plugSeat: "16", toProgrammable: "", controlObject: "" },
  { plugSeat: "17", toProgrammable: "", controlObject: "" },
  { plugSeat: "18", toProgrammable: "", controlObject: "" },
  { plugSeat: "19", toProgrammable: "", controlObject: "" },
  { plugSeat: "20", toProgrammable: "Y27", controlObject: "轴身左右探头降" },
  { plugSeat: "21", toProgrammable: "Y20", controlObject: "轮对正转" },
  { plugSeat: "22", toProgrammable: "Y21", controlObject: "轮对反转" },
  { plugSeat: "23", toProgrammable: "Y31", controlObject: "推轮、缓冲升" },
  { plugSeat: "24", toProgrammable: "Y33", controlObject: "缓冲缸降" },
  { plugSeat: "25", toProgrammable: "Y32", controlObject: "推杆复位" },
  { plugSeat: "26", toProgrammable: "Y11", controlObject: "RD2" },
  { plugSeat: "27", toProgrammable: "Y10", controlObject: "RE2" },
  { plugSeat: "28", toProgrammable: "Y22", controlObject: "探头移动" },
  { plugSeat: "29", toProgrammable: "Y0", controlObject: "油泵" },
  { plugSeat: "30", toProgrammable: "Y1", controlObject: "耦合泵" },
  { plugSeat: "31", toProgrammable: "", controlObject: "" },
  { plugSeat: "32", toProgrammable: "N", controlObject: "220V零线" },
];

const signalMap = [
  { signal: "X16", controlObject: "左量轮径到位" },
  { signal: "X17", controlObject: "右量轮径到位" },
  { signal: "X22", controlObject: "左侧中心到位" },
  { signal: "X21", controlObject: "右侧中心到位" },
  { signal: "X30", controlObject: "RE2左端进到位" },
  { signal: "X31", controlObject: "RE2右端进到位" },
  { signal: "X23", controlObject: "左端面探头退到位" },
  { signal: "X20", controlObject: "右端面探头退到位" },
  { signal: "X24", controlObject: "轮对到位信号" },
  { signal: "X15", controlObject: "左轴身探头升到位" },
  { signal: "X32", controlObject: "右轴身探头升到位" },
];
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-highlighted text-3xl">探伤机电气接线</h1>
    <h2 class="text-highlighted text-2xl">12通道机</h2>
    <section>
      <Table class="table-fixed">
        <caption class="text-toned">
          RE2型19芯航插接线表
        </caption>
        <colgroup>
          <col />
          <col />
          <col />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableHeader>插头座编</TableHeader>
            <TableHeader>接至可编程</TableHeader>
            <TableHeader>控制对象</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow v-for="row in aviationPlug19core" :key="row.plugSeat">
            <TableCell>{{ row.plugSeat }}</TableCell>
            <TableCell>{{ row.toProgrammable }}</TableCell>
            <TableCell>{{ row.controlObject }}</TableCell>
          </TableRow>
        </TableBody>
        <TableFoot>
          <TableRow>
            <TableCell colspan="3" class="space-y-2">
              <p class="text-xl">备注：</p>
              <p>
                在控制柜中，TD接9蕊航插
                <UBadge variant="outline" size="lg"> 2 </UBadge>
                脚，RD接9蕊航插
                <UBadge variant="outline" size="lg"> 3 </UBadge>
                脚，GND接9蕊航插
                <UBadge variant="outline" size="lg"> 5 </UBadge>
                脚；
              </p>
              <p>
                在配电盘处，TD接9蕊航插
                <UBadge variant="outline" size="lg"> 3 </UBadge>
                脚，RD接9蕊航插
                <UBadge variant="outline" size="lg"> 2 </UBadge>
                脚，GND接9蕊航插
                <UBadge variant="outline" size="lg"> 5 </UBadge>
                脚；
              </p>
            </TableCell>
          </TableRow>
        </TableFoot>
      </Table>
    </section>
    <section>
      <Table class="table-fixed">
        <caption class="text-toned">
          H型32芯接线表
        </caption>
        <colgroup>
          <col />
          <col />
          <col />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableHeader>插头座编</TableHeader>
            <TableHeader>接至可编程</TableHeader>
            <TableHeader>控制对象</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow v-for="row in h32core" :key="row.plugSeat">
            <TableCell>{{ row.plugSeat }}</TableCell>
            <TableCell>{{ row.toProgrammable }}</TableCell>
            <TableCell>{{ row.controlObject }}</TableCell>
          </TableRow>
        </TableBody>
        <TableFoot>
          <TableRow>
            <TableCell>插头座编</TableCell>
            <TableCell>接至可编程</TableCell>
            <TableCell>控制对象</TableCell>
          </TableRow>
        </TableFoot>
      </Table>
    </section>
    <section>
      <Table>
        <caption class="text-toned">
          信号输入映射表
        </caption>
        <colgroup>
          <col />
          <col />
          <col />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableHeader>接至可编程</TableHeader>
            <TableHeader>控制对象</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow v-for="row in signalMap" :key="row.signal">
            <TableCell>{{ row.signal }}</TableCell>
            <TableCell>{{ row.controlObject }}</TableCell>
          </TableRow>
        </TableBody>
        <TableFoot>
          <TableRow>
            <TableCell>接至可编程</TableCell>
            <TableCell>控制对象</TableCell>
          </TableRow>
        </TableFoot>
      </Table>
    </section>
  </div>
</template>
