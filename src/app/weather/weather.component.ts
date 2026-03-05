import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ApixuService } from '../apixu.service';

export interface WeatherResponse {
  location?: { name?: string; region?: string; country?: string };
  current?: {
    temperature?: number;
    feelslike?: number;
    weather_descriptions?: string[];
  };
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  weatherSearchForm: UntypedFormGroup;
  weatherData: WeatherResponse | null = null;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apixuService: ApixuService
  ) {}

  ngOnInit(): void {
    this.weatherSearchForm = this.formBuilder.group({
      location: [''],
    });
  }

  sendToAPIXU(formValues: { location: string }): void {
    const location = (formValues?.location || '').trim();
    if (!location) {
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    this.apixuService.getWeather(location).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Weather request failed', err);
        this.weatherData = null;
        this.loading = false;
        this.errorMessage =
          err?.error?.error?.info || err?.message || 'Failed to load weather. Please try again.';
      },
    });
  }
}
