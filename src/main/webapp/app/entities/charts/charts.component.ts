// import { Component, OnInit } from '@angular/core';
// import { HttpResponse } from '@angular/common/http';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//
// // import { ICharts } from '../charts.model';
// // import { ChartsService } from '../service/charts.service';
// // import { ChartsDeleteDialogComponent } from '../delete/charts-delete-dialog.component';
//
//
// @Component({
//   selector: 'anna-charts',
//   templateUrl: './charts.component.html',
//   styleUrls: ['./charts.component.css']
//
// })
// export class ChartsComponent implements OnInit {
//   public YT: any;
//   public video: any;
//   public player: any;
//   public reframed: boolean = false;
//   constructor() { }
//
//   init() {
//     let tag = document.createElement('script');
//     tag.src = 'https://www.youtube.com/iframe_api';
//     let firstScriptTag = document.getElementsByTagName('script')[0];
//     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//   }
//
//   ngOnInit() {
//     this.init();
//     this.video = '1cH2cerUpMQ' //video id
//
//     window['onYouTubeIframeAPIReady'] = (e) => {
//       this.YT = window['YT'];
//       this.reframed = false;
//       this.player = new window['YT'].Player('player', {
//         videoId: this.video,
//         events: {
//           'onStateChange': this.onPlayerStateChange.bind(this),
//           'onError': this.onPlayerError.bind(this),
//           'onReady': (e) => {
//             e.target.playVideo();
//           }
//         }
//       });
//     };
//   }
//
//   stopVideo() {
//     this.player.stopVideo();
//   }
//
//   onPlayerStateChange(event:any) {
//     switch (event.data) {
//       case window['YT'].PlayerState.PLAYING:
//         if (this.cleanTime() == 0) {
//           console.log('started ' + this.cleanTime());
//         } else {
//           console.log('playing ' + this.cleanTime())
//         };
//         break;
//       case window['YT'].PlayerState.PAUSED:
//         if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
//           console.log('paused' + ' @ ' + this.cleanTime());
//         };
//         break;
//       case window['YT'].PlayerState.ENDED:
//         console.log('ended ');
//         break;
//     };
//   };
//   //utility
//   cleanTime() {
//     return Math.round(this.player.getCurrentTime())
//   };
//   onPlayerError(event:any) {
//     switch (event.data) {
//       case 2:
//         console.log('' + this.video)
//         break;
//       case 100:
//         break;
//       case 101 || 150:
//         break;
//     };
//   };
//
// }
