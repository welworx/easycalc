import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

/**
 * @title Stepper overview
 */
@Component({
  selector: 'easycalc-form',
  templateUrl: './easycalc-form.component.html',
  styleUrls: ['./easycalc-form.component.css']
})
export class EasycalcFormComponent implements OnInit {
  isLinear = false;
  SystemInputVolumeFormGroup: FormGroup;
  BilledConsumptionFormGroup: FormGroup;
  UnbilledConsumptionFormGroup: FormGroup;
  CommercialLossesFormGroup: FormGroup;
  InfrastructureFormGroup: FormGroup;
  LevelofServiceFormGroup: FormGroup;
  FinancialsFormGroup: FormGroup;
  colorControl = new FormControl('primary');

  PhysicalLossesScalerMin =0;
  PhysicalLossesScalerMax =10;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.SystemInputVolumeFormGroup = this._formBuilder.group({
          SystemInputVolumeCtrl: ['', Validators.required],
          SIVAccuracyAssessmentCtrl: ['', Validators.required]
        });
    this.BilledConsumptionFormGroup = this._formBuilder.group({
          MeteredBilledConsumptionCtrl: ['', Validators.required],
          UnmeteredBilledConsumptionCtrl: ['0', Validators.required]
        });
    this.UnbilledConsumptionFormGroup = this._formBuilder.group({
          MeteredUnbilledConsumptionCtrl: ['', Validators.required],
          UnmeteredUnbilledConsumptionCtrl: ['', Validators.required]
        });
    this.CommercialLossesFormGroup = this._formBuilder.group({
          CostumerMeterUnderRegistrationCtrl: ['', Validators.required],
          IllegalConnectionsCtrl:  ['', Validators.required]
        });
    this.InfrastructureFormGroup = this._formBuilder.group({
          PipelineLengthCtrl: ['', Validators.required],
          NumerOfAccountsCtrl: ['', Validators.required],
          NumerOfServiceConnectionsCtrl: ['', Validators.required]
        });
    this.LevelofServiceFormGroup = this._formBuilder.group({
          PressureSelectCtrl: ['', Validators.required],
          PressureCtrl: ['', Validators.required],          
          SupplyTimeSelectCtrl: ['', Validators.required],
          SupplyTimeCtrl: ['', Validators.required]
        });
    this.FinancialsFormGroup = this._formBuilder.group({
          AverageTariffCtrl: ['', Validators.required],
          VariableProductionAndDistributionCostCtrl: ['', Validators.required],
          AnnualOperatingCostCtrl: ['', Validators.required],
          ValueRecoveredPhysicalLossesCtrl: ['', Validators.required],
          ValueRecoveredPhysicalLossesSliderCtrl: ['', Validators.required]
        });
  }
}


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */