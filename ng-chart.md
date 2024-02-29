[< Back to main Menu](https://github.com/gsoulie/angular-resources/blob/master/ng-sheet.md)    

# Chart

* [ChartJS](https://www.chartjs.org)     
* [Apexchart](#apexchart)     
* [Google charts](#google-charts)     
* [Chartist](#chartist)     
* [Victory](#victory)
* [Apache Echarts](#apache-echarts)      

Liste des meilleures librairies : https://www.atatus.com/blog/javascript-chart-libraries     

## Apexchart

### Installation

Documentation : https://apexcharts.com/docs/angular-charts/     
Demos : https://apexcharts.com/angular-chart-demos/      
Line chart : https://apexcharts.com/docs/chart-types/line-chart/     

````
npm install apexcharts ng-apexcharts --save 
````

*angular.json*

Ajouter le script suivant dans les noeuds *scripts*

````typescript
"scripts": [
  "node_modules/apexcharts/dist/apexcharts.min.js"
]
````

*import app.module.ts ou dans les standalone component*

````typescript
import { NgApexchartsModule } from 'ng-apexcharts';

imports: [
	...,
	NgApexchartsModule,
]
````

### Exemples

[>> Projet exemple](https://github.com/gsoulie/angular-apexchart)     

[Bact to top](#chart)    

## Google charts

https://www.w3schools.com/js/js_graphics_google_chart.asp     
https://developers.google.com/chart/interactive/docs/gallery     

## Chartist

[Bact to top](#chart)    

## Victory

Documentation : https://formidable.com/open-source/victory/docs/victory-pie    

[Bact to top](#chart) 

## ChartCss

Librairie 100% css : https://chartscss.org/

## Apache Echarts

<details>
	<summary>Présentation</summary>

Apache EChart est une librairie javascript opensource fournissant un très large éventail de graphiques en tout genre

> [ECharts examples](https://echarts.apache.org/examples/en/index.html)

### Installation

Pour faciliter l'intégration de EChart avec Angular, il est conseillé d'utiliser le paquet *ngx-echarts*

````
npm i ngx-echarts
````

### Configuration

*ngx-echarts* nous permet d'importer la librairie complète ou bien de pouvoir importer uniquement les éléments nécessaires (consulter la documentation pour plus de détail)

[https://www.npmjs.com/package/ngx-echarts#custom-build](https://www.npmjs.com/package/ngx-echarts#custom-build)

> **Bonne pratique** : Il est recommandé de réaliser un import personnalisé des éléments utiles uniquement dans un souci évident de NR

#### Imports personnalisés

*app.config.ts*

````typescript
import { provideEchartsCore } from 'ngx-echarts';

// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components';

// Features like Universal Transition and Label Layout
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { LineChart } from 'echarts/charts';
import { PieChart } from 'echarts/charts';

// Register the required components
echarts.use([
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LineChart,
  TooltipComponent,
  LegendComponent
]);

export const appConfig: ApplicationConfig = {
  providers: [ 
    provideEchartsCore({ echarts })
  ]
};

````

#### Import complet

*app.config.ts*

````typescript
import * as echarts from 'echarts';

export const appConfig: ApplicationConfig = {
  providers: [ 
    provideEchartsCore({ echarts })
  ]
};
````

### Utilisation

Exemple d'intégration d'un graphique de type *line* et d'un graphique de type *pie*

````typescript
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgxEchartsDirective, NgxEchartsModule } from "ngx-echarts";
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-basechart',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsDirective,
    NgxEchartsModule,
  ],
  template: `
  <div echarts [options]="chartOption" class="demo-chart"></div>
  <div echarts [options]="pieChartOption" class="pie-chart"></div>
  `,
  styles: `
  .demo-chart, .pie-chart {
    height: 400px;
  }
  `
})

export default class BasechartComponent implements OnInit {

  chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  };

  pieChartOption: EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      }
    ]
  };


  ngOnInit(): void {

  }
}

````
 
</details>
