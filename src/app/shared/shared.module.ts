import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {MatDividerModule} from "@angular/material/divider";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatMenuModule} from "@angular/material/menu";
import {MatListModule} from "@angular/material/list";
import {RouterModule} from "@angular/router";
import { AreaComponent } from './widgets/area/area.component';
import {HighchartsChartModule} from "highcharts-angular";
import { CardComponent } from './widgets/card/card.component';
import { LoginComponent } from './components/login/login.component';
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { RegisterComponent } from './components/register/register.component';
import { ErrorComponent } from './components/error/error.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginatorModule} from "@angular/material/paginator";
import {HotelTitleFilter} from "./widgets/area/scraps-filter.pipe";
import {MatSelectModule} from "@angular/material/select";
import {HotelCityFilter} from "./widgets/area/scraps-city";
import {HotelAddressFilter} from "./widgets/area/scraps-address";
import { MapComponent } from './components/map/map.component';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {ReviewComponent} from "../modules/review/review-creation/review.component";
import {ReviewListComponent} from "../modules/review/review-list/review-list.component";
import {MyFilterPipe} from "../modules/review/review-list/review-filter";



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    LoginComponent,
    RegisterComponent,
    ErrorComponent,
    HotelTitleFilter,
    HotelCityFilter,
    HotelAddressFilter,
    MapComponent,
    ReviewComponent,
    ReviewListComponent,
    MyFilterPipe,
  ],
  exports: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    AreaComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    HighchartsChartModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatPaginatorModule,
    MatSelectModule,
    LeafletModule
  ]
})
export class SharedModule { }
