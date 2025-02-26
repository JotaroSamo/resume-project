import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private devopsImage = new Image();
  private obstacleImage = new Image();
  private devopsX = 50;
  private devopsY = 500;
  private obstacleX = 1100;
  private obstacleY = 500;
  private isJumping = false;
  private velocityY = 0;
  private gravity = 1.2;
  private jumpPower = -18;
  private obstacleSpeed = 8;
  private maxFallSpeed = 15;
  score = 0;
  private animationFrameId: any;
  private isGameOver = false; // Флаг окончания игры

  ngOnInit() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.devopsImage.src = 'icons/man.png';
    this.obstacleImage.src = 'icons/docker.png';
  }

  startGame() {
    this.isGameOver = false; // Сбрасываем флаг при старте
    this.devopsX = 50;
    this.devopsY = 500;
    this.velocityY = 0;
    this.obstacleX = 1100;
    this.obstacleY = Math.random() < 0.5 ? 500 : 400;
    this.obstacleSpeed = 8;
    this.score = 0;
    cancelAnimationFrame(this.animationFrameId);
    this.gameLoop();
  }

  @HostListener('window:mousedown', ['$event'])
  handleMouseClick(event: MouseEvent) {
    if (this.isGameOver) return; // Запрещаем взаимодействие после проигрыша
    if (event.button === 0 && !this.isJumping) {
      this.isJumping = true;
      this.velocityY = this.jumpPower;
    } else if (event.button === 2) {
      event.preventDefault();
      this.devopsY = 500;
      this.velocityY = 0;
    }
  }

  private gameLoop() {
    if (this.isGameOver) return; // Не продолжаем цикл, если игра окончена
    this.updateGame();
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  private updateGame() {
    this.clearCanvas();
    this.moveObstacle();
    this.applyGravity();
    this.checkCollision();
    this.drawDevops();
    this.drawObstacle();
    this.drawScore();
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private moveObstacle() {
    if (this.obstacleX < -70) {
      this.obstacleX = 1100;
      this.obstacleY = Math.random() < 0.5 ? 500 : 400;
      this.score++;
      this.obstacleSpeed += 0.2;
    } else {
      this.obstacleX -= this.obstacleSpeed;
    }
  }

  private applyGravity() {
    if (this.devopsY < 500) {
      this.velocityY += this.gravity;
      if (this.velocityY > this.maxFallSpeed) {
        this.velocityY = this.maxFallSpeed;
      }
    } else {
      this.devopsY = 500;
      this.isJumping = false;
    }
    this.devopsY += this.velocityY;
  }

  private checkCollision() {
    if (this.devopsX < this.obstacleX + 70 && this.devopsX + 70 > this.obstacleX &&
        this.devopsY < this.obstacleY + 70 && this.devopsY + 70 > this.obstacleY) {
      this.endGame();
    }
  }

  private endGame() {
    this.isGameOver = true;
    cancelAnimationFrame(this.animationFrameId);
    this.drawGameOverText();
  }

  private drawDevops() {
    this.ctx.drawImage(this.devopsImage, this.devopsX, this.devopsY, 70, 70);
  }

  private drawObstacle() {
    this.ctx.drawImage(this.obstacleImage, this.obstacleX, this.obstacleY, 70, 70);
  }

  private drawScore() {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
  }

  private drawGameOverText() {
    this.ctx.font = "40px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.fillText("Game Over", this.canvas.width / 2 - 100, this.canvas.height / 2);
    this.ctx.fillText("Click to Restart", this.canvas.width / 2 - 130, this.canvas.height / 2 + 50);

    // Добавляем обработчик клика для перезапуска игры
    this.canvas.addEventListener('click', () => this.startGame(), { once: true });
  }
}
