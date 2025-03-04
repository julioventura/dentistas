import { Component, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnChanges, AfterViewInit {
  @Input() userProfile: any;
  @Input() darkMode: boolean = false;
  
  address: string = '';
  googleMapsUrl: string = '';
  
  constructor() {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userProfile']) {
      this.updateAddress();
    }
  }
  
  ngAfterViewInit(): void {
    this.updateAddress();
  }
  
  getAddressTitle(): string {
    return this.userProfile?.nomeClinica || 'Consultório';
  }
  
  private updateAddress(): void {
    if (!this.userProfile) {
      // Endereço padrão se não houver perfil
      this.address = 'Av. Paulista, 1000, São Paulo - SP';
    } else {
      // Construir endereço a partir do perfil do usuário
      const parts: string[] = [];
      
      if (this.userProfile.endereco) parts.push(this.userProfile.endereco);
      if (this.userProfile.bairro) parts.push(this.userProfile.bairro);
      if (this.userProfile.cidade) parts.push(this.userProfile.cidade);
      if (this.userProfile.estado) parts.push(this.userProfile.estado);
      
      this.address = parts.join(', ') || 'Av. Paulista, 1000, São Paulo - SP';
    }
    
    // URL para abrir no Google Maps
    if (this.address) {
      const encodedAddress = encodeURIComponent(this.address);
      this.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }
  }
}
