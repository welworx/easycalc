import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

/**
 * @title Stepper overview
 */
@Component({
  selector: 'easycalc-form',
  templateUrl: './easycalc-form.component.html',
  styleUrls: ['./easycalc-form.component.css']
})
export class EasycalcFormComponent implements OnInit {
  isLinear = true;
  SystemInputVolumeFormGroup: FormGroup;
  BilledConsumptionFormGroup: FormGroup;
  UnbilledConsumptionFormGroup: FormGroup;
  CommercialLossesFormGroup: FormGroup;
  InfrastructureFormGroup: FormGroup;
  LevelofServiceFormGroup: FormGroup;
  FinancialsFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.SystemInputVolumeFormGroup = this._formBuilder.group({
          SystemInputVolumeCtrl: ['', Validators.required]
        });
    this.BilledConsumptionFormGroup = this._formBuilder.group({
          BilledConsumptionCtrl: ['', Validators.required]
        });
    this.UnbilledConsumptionFormGroup = this._formBuilder.group({
          UnbilledConsumptionCtrl: ['', Validators.required]
        });
    this.CommercialLossesFormGroup = this._formBuilder.group({
          CommercialLossesCtrl: ['', Validators.required]
        });
    this.InfrastructureFormGroup = this._formBuilder.group({
          InfrastructureCtrl: ['', Validators.required]
        });
    this.LevelofServiceFormGroup = this._formBuilder.group({
          LevelofServiceCtrl: ['', Validators.required]
        });
    this.FinancialsFormGroup = this._formBuilder.group({
          FinancialsCtrl: ['', Validators.required]
        });
  }
}


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */