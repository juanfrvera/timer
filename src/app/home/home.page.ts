import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { SmartAudio } from '../services/providers/smart-audio-provider.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public main = {
    minutes: 2,
    seconds: 0
  };
  public rest = {
    minutes: 1,
    seconds: 0
  };

  public timer = {
    minutes: 2,
    seconds: 0
  }

  private resting: boolean = false;

  public notifications: string[] = [
    "done-for-you",
    "goes-without-saying",
    "got-it-done",
    "hasty-ba-dum-tss",
    "juntos",
    "percussion",
    "piece-of-cake",
    "pristine",
    "swiftly"
  ];

  private currentNotification: string = this.notifications[0];
  private showOnTitle: boolean = false;

  constructor(private smartAudio: SmartAudio, private titleService: Title) {
  }

  ngOnInit(): void {
    this.notifications.forEach(notif => {
      this.smartAudio.preload(notif, 'assets/notifications/' + notif + '.mp3');
    });
    // RxJS v6+
    /*
      timer takes a second argument, how often to emit subsequent values
      in this case we will emit first value after 1 second and subsequent
      values every 2 seconds after
    */
    //output: 0,1,2,3,4,5......
    timer(1000, 1000).subscribe(v => this.secondPassed());
  }

  private secondPassed() {
    if (this.timer.seconds > 0) {
      this.timer.seconds--;
    }
    else {
      if (this.timer.minutes > 0) {
        this.timer.minutes--;
        this.timer.seconds = 59;
      }
      else {
        this.timerEnded();
      }
    }

    if (this.showOnTitle) {
      this.drawOnTitle();
    }
  }

  private timerEnded() {
    if (this.currentNotification != 'none') {
      this.playSound(this.currentNotification);
    }

    this.resting = !this.resting;

    this.timer.minutes = this.resting ? this.rest.minutes : this.main.minutes;
    this.timer.seconds = this.resting ? this.rest.seconds : this.main.seconds;
  }

  private playSound(soundId) {
    this.smartAudio.play(soundId);
  }

  private drawOnTitle() {
    this.titleService.setTitle("Timer: " + this.timer.minutes + ":" + this.timer.seconds);
  }

  public mainChanged() {
    if (!this.resting) {
      this.timer.minutes = this.main.minutes;
      this.timer.seconds = this.main.seconds;
    }
  }
  public restChanged() {
    if (this.resting) {
      this.timer.minutes = this.rest.minutes;
      this.timer.seconds = this.rest.seconds;
    }
  }

  public soundChanged($event) {
    this.currentNotification = $event.target.value;

    if (this.currentNotification != 'none') {
      this.playSound(this.currentNotification);
    }
  }

  public showOnTitleChanged() {
    if (!this.showOnTitle) {
      this.titleService.setTitle("Timer");
    }
    else {
      this.drawOnTitle();
    }
  }
}
