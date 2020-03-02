import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatisticsPageRoutingModule } from './statistics-routing.module';

import { StatisticsPage } from './statistics.page';
import {HighchartsChartModule} from 'highcharts-angular';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        StatisticsPageRoutingModule,
        HighchartsChartModule
    ],
  declarations: [StatisticsPage]
})
export class StatisticsPageModule {}
