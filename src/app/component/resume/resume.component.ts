import { Component, OnInit } from '@angular/core';
import { AgeService } from '../../service/age.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-resume',
  imports: [CommonModule, RouterLink],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss'
})
export class ResumeComponent implements OnInit {
  birthDate: Date = new Date('2002-08-26');
  age: number = 0;
  icons: { id: number; src: string; left: string; size: string; duration: string; rotation: string }[] = [];
  iconPool: string[] = [
    'icons/city.png',
    'icons/cyber-eye.png',
    'icons/energy-drink.png',
    'icons/hand.png',
    'icons/laptop.png',
    'icons/man.png',
    'icons/skull.png'
  ];
  private iconIdCounter = 0;

  constructor(private ageService: AgeService) {}

  ngOnInit(): void {
    this.calculateAge();
    this.startIconGeneration();
  }

  calculateAge(): void {
    this.age = this.ageService.calculateAge(this.birthDate);
  }

  startIconGeneration(): void {
    setInterval(() => {
      this.addFallingIcon();
    }, 1000); 
  }

  addFallingIcon(): void {
    const randomIndex = Math.floor(Math.random() * this.iconPool.length);
    const newIcon = {
      id: this.iconIdCounter++,
      src: this.iconPool[randomIndex],
      left: `${Math.random() * 100}vw`,
      size: `${Math.random() * 30 + 10}px`,
      duration: `${Math.random() * 10 + 5}s`, 
      rotation: `${Math.random() * 360}deg`,
    };

    this.icons.push(newIcon);

    
    setTimeout(() => {
      this.icons = this.icons.filter(icon => icon.id !== newIcon.id);
    }, parseFloat(newIcon.duration) * 1000);
  }
}
