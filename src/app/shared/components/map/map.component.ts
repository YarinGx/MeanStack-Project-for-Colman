import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {
  Map,
  Control,
  DomUtil,
  ZoomAnimEvent,
  Layer,
  MapOptions,
  tileLayer,
  latLng,
  LeafletEvent,
  marker, circle
} from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css',]
})
export class MapComponent implements OnInit, OnDestroy {
  @Output() map$: EventEmitter<Map> = new EventEmitter;
  @Output() zoom$: EventEmitter<number> = new EventEmitter;
  @Input() latitude: string = '0';
  @Input() longitude: string = '0';
  @Input() options: MapOptions= {
    layers:[tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      opacity: 0.7,
      maxZoom: 19,
      detectRetina: true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })],
    zoom:16,
    center:latLng(0, 0)

  };
  public map!: Map;
  public zoom!: number;

  constructor() {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.map.clearAllEventListeners;
    // this.map.remove();
  };

  onMapReady(map: Map) {
    this.map = map;

    this.map$.emit(map);
    this.zoom = map.getZoom();
    this.zoom$.emit(this.zoom);
    if(this.latitude!=null && this.longitude!=null) {
      this.map.panTo([parseFloat(this.latitude), parseFloat(this.longitude)])
      circle([parseFloat(this.latitude), parseFloat(this.longitude)]).addTo(this.map);
    }

  }

  onMapZoomEnd(e: LeafletEvent) {
    this.zoom = e.target.getZoom();
    this.zoom$.emit(this.zoom);
  }
}
