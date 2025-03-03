import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cabecalho-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cabecalho-homepage.component.html',
  styleUrls: ['./cabecalho-homepage.component.scss']
})
export class CabecalhoHomepageComponent {
  @Input() userProfile: any;
  
  isScrolled = false;
  isMobileMenuOpen = false;
  
  menuItems = [
    { label: 'Home', route: '/' },
    { label: 'Sobre', route: '/sobre' },
    { label: 'Serviços', route: '/servicos' },
    { label: 'Blog', route: '/blog' },
    { label: 'Contato', route: '/contato' }
  ];
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 60;
  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}