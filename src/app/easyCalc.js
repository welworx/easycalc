import {
    createModelSchema,
    primitive,
    reference,
    list,
    object,
    identifier,
    serialize,
    deserialize,
} from 'serializr';

const easyCalcVersion = 'EC-2018-12';

/**
 * WB EasyCalc mobile logic
 * 
 * This class does all the calculation in the easycalc mobile app. The redux-store input
 * data is read, and the results are added to the current store state.
 * 
 * Notes: 
 * - VAR is used for abbreviation of "Variance"
 * - ERR is used for abbreviation of "Error"
 * - All values are deliverd in their approrpriate units. However, the errors (ERR) must be multiplied with 100 if needed in %.
 * 
 * @example
 * import { easyCalc } from '../easyCalc/easyCalc';
 * const ec = new easyCalc();
 *
 * @version EC-2018-1
 * @author [Werner Liemberger](werner@liemberger.cc)
 * @author [Roland Liemberger](roland@liemberger.cc)
*/
class easyCalc {

    constructor() {
        // define all needed variables and initialise them with null.
        this.systemInputVolume = null;
        this.systemInputVolumeChoice = null;
        this.systemInputVolumeValue = null;
        this.billingConsumptionMetered = null;
        this.billingConsumptionUnmetered = null;
        this.unbilledConsumptionMetered = null;
        this.unbilledConsumptionUnmeteredValue = null;
        this.unbilledConsumptionUnmeteredChoice = null;
        this.customerMeterUnderRegistrationChoice = null;
        this.customerMeterUnderRegistrationValue = null;
        this.illegalConnectionsChoice = null;
        this.pipelineLength = null;
        this.numberOfCustomerAccounts = null;
        this.numberOfServiceConnections = null;
        this.supplyTimeChoice = null;
        this.supplyTimeValue = null;
        this.pressureChoice = null;
        this.pressureValue = null;

        this.currency = null;
        this.averageTariff = null;
        this.variableProductionAndDistributionCost = null;
        this.annualOperatingCost = null;
        this.howToValueRecoveredLosses = null;
    }

    updateInputValues(store) {
        // update all input variables with values of the redux store or set them 0 if not existing
        this.systemInputVolume = Number(store.systemInputVolume || 0);
        this.systemInputVolumeChoice = Number(store.systemInputVolumeChoice || 0);
        this.systemInputVolumeValue = Number(store.systemInputVolumeValue || 0);
        this.billingConsumptionMetered = Number(store.billingConsumptionMetered || 0);
        this.billingConsumptionUnmetered = Number(store.billingConsumptionUnmetered || 0);
        this.unbilledConsumptionMetered = Number(store.unbilledConsumptionMetered || 0);
        this.unbilledConsumptionUnmeteredValue = Number(store.unbilledConsumptionUnmeteredValue || 0);
        this.unbilledConsumptionUnmeteredChoice = Number(store.unbilledConsumptionUnmeteredChoice || 0);
        this.customerMeterUnderRegistrationChoice = Number(store.customerMeterUnderRegistrationChoice || 0);
        this.customerMeterUnderRegistrationValue = Number(store.customerMeterUnderRegistrationValue);
        this.illegalConnectionsChoice = Number(store.illegalConnectionsChoice || 0);
        this.pipelineLength = Number(store.pipelineLength || 0);
        this.numberOfCustomerAccounts = Number(store.numberOfCustomerAccounts || 0);
        this.numberOfServiceConnections = Number(store.numberOfServiceConnections || 0);
        this.supplyTimeChoice = Number(store.supplyTimeChoice || 0);
        this.supplyTimeValue = Number(store.supplyTimeValue || 0);
        this.pressureChoice = Number(store.pressureChoice || 0);
        this.pressureValue = Number(store.pressureValue || 0);

        this.currency = String(store.currency);
        this.averageTariff = Number(store.averageTariff || 0);
        this.variableProductionAndDistributionCost = Number(store.variableProductionAndDistributionCost || 0);
        this.annualOperatingCost = Number(store.annualOperatingCost || 0);
        this.howToValueRecoveredLosses = Number(store.howToValueRecoveredLosses || 0);
    }
    updateResults(state = store) {
        /**
         * add/update all results to the redux store
         * 
         * Note: in case the input values have not been present before and are updated in the
         * updateInputValues() their changes are not written back due to potential  performance issues (loop of setting prameters).
         * TODO: check if this has a negative effect!
         */

        this.updateInputValues(state);
        return {
            ...state,
            billedConsumptionTotal: this.billedConsumptionTotal(),
            unbilledConsumptionTotal: this.unbilledConsumptionTotal(),
            totalAuthorizedConsumption: this.totalAuthorizedConsumption(),
            customerMeterUnderRegistration: this.customerMeterUnderRegistration(),
            unauthorizedConsumption: this.unauthorizedConsumption(),
            commercialLossesTotal: this.commercialLossesTotal(),
            physicalLosses: this.physicalLosses(),
            waterLosses: this.waterLosses(),
            nrw: this.nrw(),
            totalNumberOfServiceConnections: this.totalNumberOfServiceConnections(),
            pressure: this.pressure(),
            supplyTime: this.supplyTime(),
            capl: this.capl(),
            mapl: this.mapl(),
            ili: this.ili(),
            litersPerConnectionPerDay: this.litersPerConnectionPerDay(),
            litersPerConnectionPerDayPerMeterPressure: this.litersPerConnectionPerDayPerMeterPressure(),
            cubicmeterPerKilometerMainsPerHour: this.cubicmeterPerKilometerMainsPerHour(),
            commercialLossesExpressedInPercentOfAuthorizedConsumption: this.commercialLossesExpressedInPercentOfAuthorizedConsumption(),
            litersPerConnectionPerDayCommercialLoss: this.litersPerConnectionPerDayCommercialLoss(),
            litersPerCustomerPerDayCommercialLoss: this.litersPerCustomerPerDayCommercialLoss(),
            volumeOfNonRevenueWater: this.volumeOfNonRevenueWater(),
            litersPerConnectionPerDayNRW: this.litersPerConnectionPerDayNRW(),
            systemInputVolumeERR: this.systemInputVolumeERR(),
            systemInputVolumeSTD: this.systemInputVolumeSTD(),
            systemInputVolumeVAR: this.systemInputVolumeVAR(),
            unbilledConsumptionUnmetered: this.unbilledConsumptionUnmetered(),
            unbilledConsumptionUnmeteredERR: this.unbilledConsumptionUnmeteredERR(),
            unbilledConsumptionUnmeteredSTD: this.unbilledConsumptionUnmeteredSTD(),
            unbilledConsumptionUnmeteredVAR: this.unbilledConsumptionUnmeteredVAR(),
            unbilledConsumptionTotalERR: this.unbilledConsumptionTotalERR(),
            unbilledConsumptionTotalSTD: this.unbilledConsumptionTotalSTD(),
            unbilledConsumptionTotalVAR: this.unbilledConsumptionTotalVAR(),
            totalAuthorizedConsumptionERR: this.totalAuthorizedConsumptionERR(),
            totalAuthorizedConsumptionSTD: this.totalAuthorizedConsumptionSTD(),
            totalAuthorizedConsumptionVAR: this.totalAuthorizedConsumptionVAR(),

            customerMeterUnderRegistrationERR: this.customerMeterUnderRegistrationERR(),
            customerMeterUnderRegistrationSTD: this.customerMeterUnderRegistrationSTD(),
            customerMeterUnderRegistrationVAR: this.customerMeterUnderRegistrationVAR(),

            unauthorizedConsumptionERR: this.unauthorizedConsumptionERR(),
            unauthorizedConsumptionSTD: this.unauthorizedConsumptionSTD(),
            unauthorizedConsumptionVAR: this.unauthorizedConsumptionVAR(),

            commercialLossesTotalERR: this.commercialLossesTotalERR(),
            commercialLossesTotalSTD: this.commercialLossesTotalSTD(),
            commercialLossesTotalVAR: this.commercialLossesTotalVAR(),

            physicalLossesERR: this.physicalLossesERR(),
            physicalLossesSTD: this.physicalLossesSTD(),
            physicalLossesVAR: this.physicalLossesVAR(),

            waterLossesERR: this.waterLossesERR(),
            waterLossesSTD: this.waterLossesSTD(),
            waterLossesVAR: this.waterLossesVAR(),

            nrwERR: this.nrwERR(),
            nrwSTD: this.nrwSTD(),
            nrwVAR: this.nrwVAR(),

            caplERR: this.caplERR(),
            maplERR: this.maplERR(),

            numberOfIllegalConnections: this.numberOfIllegalConnections(),
            numberOfIllegalConnectionsERR: this.numberOfIllegalConnectionsERR(),
            numberOfIllegalConnectionsSTD: this.numberOfIllegalConnectionsSTD(),
            numberOfIllegalConnectionsVAR: this.numberOfIllegalConnectionsVAR(),

            totalNumberOfServiceConnectionsERR: this.totalNumberOfServiceConnectionsERR(),
            totalNumberOfServiceConnectionsSTD: this.totalNumberOfServiceConnectionsSTD(),
            totalNumberOfServiceConnectionsVAR: this.totalNumberOfServiceConnectionsVAR(),


            iliERR: this.iliERR(),
            litersPerConnectionPerDayERR: this.litersPerConnectionPerDayERR(),
            litersPerConnectionPerDayPerMeterPressureERR: this.litersPerConnectionPerDayPerMeterPressureERR(),
            cubicmeterPerKilometerMainsPerHourERR: this.cubicmeterPerKilometerMainsPerHourERR(),
            commercialLossesExpressedInPercentOfAuthorizedConsumptionERR: this.commercialLossesExpressedInPercentOfAuthorizedConsumptionERR(),
            litersPerConnectionPerDayCommercialLossERR: this.litersPerConnectionPerDayCommercialLossERR(),
            litersPerCustomerPerDayCommercialLossERR: this.litersPerCustomerPerDayCommercialLossERR(),
            volumeOfNonRevenueWaterERR: this.volumeOfNonRevenueWaterERR(),
            litersPerConnectionPerDayNRWERR: this.litersPerConnectionPerDayNRWERR(),

            valueOfNrw: this.valueOfNrw(),
            valueOfNrwERR: this.valueOfNrwERR(),
            valueOfNRWInPercentOfOperatingCosts: this.valueOfNRWInPercentOfOperatingCosts(),
            valueOfNRWInPercentOfOperatingCostsERR: this.valueOfNRWInPercentOfOperatingCostsERR(),
            valueOfCommercialLosses: this.valueOfCommercialLosses(),
            valueOfCommercialLossesERR: this.valueOfCommercialLossesERR(),
            costValueOfPhyiscalLosses: this.costValueOfPhyiscalLosses(),
            costValueOfPhyiscalLossesERR: this.costValueOfPhyiscalLossesERR(),
        };
    }

    unbilledConsumptionUnmetered() {
        if (this.unbilledConsumptionUnmeteredChoice == 0) {
            return this.unbilledConsumptionUnmeteredValue;
        }
        else { //default value:
            return this.systemInputVolume * 0.8 / 100;
        }
    }

    billedConsumptionTotal() { return (this.billingConsumptionMetered + this.billingConsumptionUnmetered) }
    unbilledConsumptionTotal() { return (this.unbilledConsumptionMetered + this.unbilledConsumptionUnmetered()) }
    totalAuthorizedConsumption() { return (this.billedConsumptionTotal() + this.unbilledConsumptionTotal()) }

    customerMeterUnderRegistration() {
        if (this.customerMeterUnderRegistrationChoice == 0) {
            return this.billingConsumptionMetered / (1 - this.customerMeterUnderRegistrationValue / 100) - this.billingConsumptionMetered; //TODO: division durch 100 wurde hinzugefügt da wert in prozent vermutlich angepasst werden muss.
        }
        else if (this.customerMeterUnderRegistrationChoice == 1) {
            return this.billingConsumptionMetered / (1 - this.customerMeterUnderRegistrationValue * 0.5 / 100) - this.billingConsumptionMetered;
        } else {
            return this.billingConsumptionMetered / (1 - this.numberOfCustomerAccounts / this.customerMeterUnderRegistrationValue * 0.5 / 100) - this.billingConsumptionMetered;
        }


        if (this.customerMeterUnderRegistrationChoice == 0) {
            return (this.billingConsumptionMetered + this.unbilledConsumptionMetered) / (1 - this.customerMeterUnderRegistrationValue / 100) - (this.billingConsumptionMetered + this.unbilledConsumptionMetered);
        }
        else if (this.customerMeterUnderRegistrationChoice == 1) {
            return this.getPercentageOfCustomMeterUnderRegistration(this.customerMeterUnderRegistrationValue)
        }
        else {
            return this.getPercentageOfCustomMeterUnderRegistration(this.customerMeterUnderRegistrationValue / this.numberOfCustomerAccounts)
        }
    }
    getPercentageOfCustomMeterUnderRegistration(age) {
        //   	""" calc percentage accoding to excel table """
        if (age <= 3) { return 2 }
        else if (age <= 10) { return age - 1 }
        else { return 10 }
    }

    unauthorizedConsumption() {
        // #todo: what should be used instead of XX ?
        if (this.illegalConnectionsChoice == 0) { return this.systemInputVolume * 0.25 / 100 } // NOTE: changed from: if (this.illegalConnectionsChoice == 0) { return this.billedConsumptionTotal() * 0.5 / 100 }
        else if (this.illegalConnectionsChoice == 1) { return this.billedConsumptionTotal() * 3 / 100 }
        else { return this.billedConsumptionTotal() * 7 / 100 } //NOTE: changed from 7.5 to 7
    }

    commercialLossesTotal() {
        return (this.customerMeterUnderRegistration() + this.unauthorizedConsumption());
    }

    physicalLosses() { return this.systemInputVolume - this.billedConsumptionTotal() - this.unbilledConsumptionTotal() - this.commercialLossesTotal() }
    waterLosses() { return this.commercialLossesTotal() + this.physicalLosses() }
    nrw() { return this.unbilledConsumptionTotal() + this.waterLosses() }
    // """ tab infrastructure and LoS """

    totalNumberOfServiceConnections() {
        // #incl illegalConnections
        if (this.illegalConnectionsChoice == 0) { return this.numberOfServiceConnections * 1.005 }
        else if (this.illegalConnectionsChoice == 1) { return this.numberOfServiceConnections * 1.03 }
        else { return this.numberOfServiceConnections * 1.075 }
    }

    pressure() {
        if (this.pressureChoice < 0) { throw new Error("pressureChoice must be positive and not ", this.pressureChoice); }
        if (this.pressureChoice == 4) { return this.pressureValue }
        else { return 10 + this.pressureChoice * 10 }
    }

    supplyTime() {
        if (this.supplyTimeChoice > 6 || this.supplyTimeChoice < 0) { throw new Error("supplyTimeChoice must be 0-6 and not ", this.supplyTimeChoice); }
        let valueList = [24, 2, 4.5, 9, 15, 21, this.supplyTimeValue];
        return valueList[this.supplyTimeChoice];
    }

    // """ tab PIs """

    capl() {
        // """ current annual volume of physical losses """
        return this.physicalLosses()
    }
    mapl() {
        // """ minimum achievable volume of physical losses """
        return ((18 * this.pipelineLength + 0.8 * this.totalNumberOfServiceConnections()) * this.pressure() / 24 * this.supplyTime() / 1000);
    }

    ili() {
        // """ infrastructure leakage index """
        return this.capl() / this.mapl()
    }

    litersPerConnectionPerDay() { return this.capl() * 1000 / this.totalNumberOfServiceConnections() / this.supplyTime() * 24 }
    litersPerConnectionPerDayPerMeterPressure() { return this.litersPerConnectionPerDay() / this.pressure() }
    cubicmeterPerKilometerMainsPerHour() { return this.capl() / this.pipelineLength / this.supplyTime() }
    commercialLossesExpressedInPercentOfAuthorizedConsumption() {
        return this.commercialLossesTotal() / this.totalAuthorizedConsumption() * 100
    }

    litersPerConnectionPerDayCommercialLoss() { return this.commercialLossesTotal() / this.totalNumberOfServiceConnections() * 1000 }
    litersPerCustomerPerDayCommercialLoss() { return this.commercialLossesTotal() / this.numberOfCustomerAccounts * 1000 }
    volumeOfNonRevenueWater() { return this.nrw() / this.systemInputVolume }
    litersPerConnectionPerDayNRW() { return this.nrw() / this.totalNumberOfServiceConnections() / this.supplyTime() * 24 * 1000 }

    // """ error calculations """
    calcSTD(par, err) { return par * err / 1.96 }
    calcVAR(std) { return std ** 2 }

    systemInputVolumeERR() {

        if (this.systemInputVolumeChoice > 3 || this.systemInputVolumeChoice < 0) { throw new Error("systemInputVolumeChoice must be 0, 1, 2 or 3 and not ", this.systemInputVolumeChoice); }

        let errorVector = [1, 5, 15, this.systemInputVolumeValue];
        return errorVector[this.systemInputVolumeChoice] / 100;

    }
    systemInputVolumeSTD() { return this.calcSTD(this.systemInputVolume, this.systemInputVolumeERR()) }
    systemInputVolumeVAR() { return this.calcVAR(this.systemInputVolumeSTD()) }

    unbilledConsumptionUnmeteredERR() { return 50 / 100 }
    unbilledConsumptionUnmeteredSTD() { return this.calcSTD(this.unbilledConsumptionUnmetered(), this.unbilledConsumptionUnmeteredERR()) }
    unbilledConsumptionUnmeteredVAR() { return this.calcVAR(this.unbilledConsumptionUnmeteredSTD()) }

    unbilledConsumptionTotalERR() { return this.unbilledConsumptionUnmeteredVAR() ** (0.5) / this.unbilledConsumptionTotal() * 1.96; }
    unbilledConsumptionTotalSTD() { return this.unbilledConsumptionUnmeteredSTD() }
    unbilledConsumptionTotalVAR() { return this.unbilledConsumptionUnmeteredVAR() }

    totalAuthorizedConsumptionERR() { return this.totalAuthorizedConsumptionSTD() / this.totalAuthorizedConsumption() * 1.96 }
    totalAuthorizedConsumptionSTD() { return this.totalAuthorizedConsumptionVAR() ** (0.5)        /*# sqrt of value */ }
    totalAuthorizedConsumptionVAR() { return this.unbilledConsumptionTotalVAR() }

    customerMeterUnderRegistrationERR() { return 30 / 100 }
    customerMeterUnderRegistrationSTD() { return this.calcSTD(this.customerMeterUnderRegistration(), this.customerMeterUnderRegistrationERR()) }
    customerMeterUnderRegistrationVAR() { return this.calcVAR(this.customerMeterUnderRegistrationSTD()) }

    unauthorizedConsumptionERR() { return 50 / 100 }
    unauthorizedConsumptionSTD() { return this.calcSTD(this.unauthorizedConsumption(), this.unauthorizedConsumptionERR()) }
    unauthorizedConsumptionVAR() { return this.calcVAR(this.unauthorizedConsumptionSTD()) }

    commercialLossesTotalERR() { return this.commercialLossesTotalSTD() / this.commercialLossesTotal() * 1.96 }
    commercialLossesTotalSTD() { return this.commercialLossesTotalVAR() ** (0.5) }
    commercialLossesTotalVAR() { return this.customerMeterUnderRegistrationVAR() + this.unauthorizedConsumptionVAR() }

    physicalLossesERR() { return this.physicalLossesSTD() / this.physicalLosses() * 1.96 }
    physicalLossesSTD() { return this.physicalLossesVAR() ** (0.5) }
    physicalLossesVAR() { return this.commercialLossesTotalVAR() + this.systemInputVolumeVAR() + this.totalAuthorizedConsumptionVAR() }

    waterLossesERR() { return this.waterLossesSTD() / this.waterLosses() * 1.96 }
    waterLossesSTD() { return this.waterLossesVAR() ** (0.5) }
    waterLossesVAR() { return this.systemInputVolumeVAR() + this.totalAuthorizedConsumptionVAR() }

    nrwERR() { return this.nrwSTD() / this.waterLosses() * 1.96 }
    nrwSTD() { return this.nrwVAR() ** (0.5) }
    nrwVAR() { return this.systemInputVolumeVAR() }

    caplERR() { return this.physicalLossesERR() }

    supplytimeERRVec(supply_time_in_hours_per_day) {
        return 54.545454 - 50 / (24 - 2) * supply_time_in_hours_per_day
    }
    maplERR() {
        if (this.supplyTimeChoice > 6 || this.supplyTimeChoice < 0) { throw new Error("supplyTimeChoice must be 0-6 and not ", this.supplyTimeChoice); }
        let maplERRVec = [0, 50, 33.33, 33.33, 20, 14.3, this.supplytimeERRVec(this.supplyTimeValue)];
        return ((maplERRVec[this.supplyTimeChoice] / 100) ** 2 + 0.2 ** 2 + this.totalNumberOfServiceConnectionsERR() ** 2) ** (0.5);
    }

    numberOfIllegalConnections() { return this.totalNumberOfServiceConnections() - this.numberOfServiceConnections }
    numberOfIllegalConnectionsERR() { return 50 / 100 }
    numberOfIllegalConnectionsSTD() { return this.calcSTD(this.numberOfIllegalConnections(), this.numberOfIllegalConnectionsERR()) }
    numberOfIllegalConnectionsVAR() { return this.calcVAR(this.numberOfIllegalConnectionsSTD()) }

    totalNumberOfServiceConnectionsERR() { return this.totalNumberOfServiceConnectionsSTD() / this.totalNumberOfServiceConnections() * 1.96 }
    totalNumberOfServiceConnectionsSTD() { return this.totalNumberOfServiceConnectionsVAR() ** (0.5) }
    totalNumberOfServiceConnectionsVAR() { return this.numberOfIllegalConnectionsVAR() }

    iliERR() { return (this.caplERR() ** 2 + this.maplERR() ** 2 + this.totalNumberOfServiceConnectionsERR() ** 2) ** (0.5) }

    litersPerConnectionPerDayERR() {
        if (this.supplyTimeChoice > 6 || this.supplyTimeChoice < 0) { throw new Error("supplyTimeChoice must be 0-6 and not ", this.supplyTimeChoice); }
        let selVec = [0, 50, 33.33, 33.33, 20, 14.3, this.supplytimeERRVec(this.supplyTimeValue)];
        return ((selVec[this.supplyTimeChoice] / 100) ** 2 + this.caplERR() ** 2 + this.totalNumberOfServiceConnectionsERR() ** 2) ** (0.5);
    }


    litersPerConnectionPerDayPerMeterPressureERR() { return (this.litersPerConnectionPerDayERR() ** 2 + (20 / 100) ** 2) ** (0.5) }
    cubicmeterPerKilometerMainsPerHourERR() {
        if (this.supplyTimeChoice > 6 || this.supplyTimeChoice < 0) { throw new Error("supplyTimeChoice must be 0-6 and not ", this.supplyTimeChoice); }
        let selVec = [0, 50, 33.33, 33.33, 20, 14.3, this.supplytimeERRVec(this.supplyTimeValue)];
        return ((selVec[this.supplyTimeChoice] / 100) ** 2 + this.caplERR() ** 2) ** (0.5);
    }

    commercialLossesExpressedInPercentOfAuthorizedConsumptionERR() {
        return (this.totalAuthorizedConsumptionVAR() + this.commercialLossesTotalVAR()) ** (0.5) / (this.commercialLossesTotal()) * 1.96
    }

    litersPerConnectionPerDayCommercialLossERR() { return ((this.totalNumberOfServiceConnectionsERR() ** 2 + this.commercialLossesTotalERR() ** 2) ** (0.5)) }
    litersPerCustomerPerDayCommercialLossERR() { return this.commercialLossesTotalERR() }
    volumeOfNonRevenueWaterERR() { return this.nrwERR() }
    litersPerConnectionPerDayNRWERR() { return (this.volumeOfNonRevenueWaterERR() ** 2 + this.caplERR() ** 2 + this.totalNumberOfServiceConnectionsERR() ** 2) ** (0.5) }

    valueOfNrw() { return (this.unbilledConsumptionTotal() * this.variableProductionAndDistributionCost + this.commercialLossesTotal() * this.averageTariff + this.physicalLosses() * this.howToValueRecoveredLosses) * 365 }
    valueOfNrwERR() { return this.nrwERR() }

    valueOfNRWInPercentOfOperatingCosts() { return this.valueOfNrw() / this.annualOperatingCost * 100; }
    valueOfNRWInPercentOfOperatingCostsERR() { return this.valueOfNrwERR(); }
    valueOfCommercialLosses() { return this.commercialLossesTotal() * this.averageTariff * 365; }
    valueOfCommercialLossesERR() { return this.commercialLossesTotalERR(); }
    costValueOfPhyiscalLosses() { return this.physicalLosses() * this.howToValueRecoveredLosses * 365; }
    costValueOfPhyiscalLossesERR() { return this.physicalLossesERR(); }
};

/**
 * serialise input value to create a QR code afterwards
 * @param {*} inputProps 
 */
function serialiseInput(inputProps) {
    return JSON.stringify([easyCalcVersion,
        inputProps.systemInputVolume,
        inputProps.systemInputVolumeChoice,
        inputProps.systemInputVolumeValue,
        inputProps.billingConsumptionMetered,
        inputProps.billingConsumptionUnmetered,
        inputProps.unbilledConsumptionMetered,
        inputProps.unbilledConsumptionUnmeteredValue,
        inputProps.unbilledConsumptionUnmeteredChoice,
        inputProps.customerMeterUnderRegistrationChoice,
        inputProps.customerMeterUnderRegistrationValue,
        inputProps.illegalConnectionsChoice,
        inputProps.pipelineLength,
        inputProps.numberOfCustomerAccounts,
        inputProps.numberOfServiceConnections,
        inputProps.supplyTimeChoice,
        inputProps.pressureChoice,
        inputProps.pressureValue,

        inputProps.currency,
        inputProps.averageTariff,
        inputProps.variableProductionAndDistributionCost,
        inputProps.annualOperatingCost,
        inputProps.howToValueRecoveredLosses,
    ]);
}

/**
 * Convert input string, gained via QR code, to an object
 * that is further used to initialise the redux-store and
 * sets the input parameters which triggers the calcuation.
 * 
 * @param {*} dataStr 
 */
function buildEasyCalcInput(dataStr) {
    var dataArray = JSON.parse(dataStr);

    res = new Object();

    if (easyCalcVersion == dataArray[0]) {

        keys_array = [
            'easyCalcVersion',
            'systemInputVolume',
            'systemInputVolumeChoice',
            'systemInputVolumeValue',
            'billingConsumptionMetered',
            'billingConsumptionUnmetered',
            'unbilledConsumptionMetered',
            'unbilledConsumptionUnmeteredValue',
            'unbilledConsumptionUnmeteredChoice',
            'customerMeterUnderRegistrationChoice',
            'customerMeterUnderRegistrationValue',
            'illegalConnectionsChoice',
            'pipelineLength',
            'numberOfCustomerAccounts',
            'numberOfServiceConnections',
            'supplyTimeChoice',
            'supplyTimeValue',
            'pressureChoice',
            'pressureValue',
            'currency',
            'averageTariff',
            'variableProductionAndDistributionCost',
            'annualOperatingCost',
            'howToValueRecoveredLosses'];

        for (var i = 1; i < keys_array.length; i++) {
            res[keys_array[i]] = dataArray[i];
        }
        return res;
    }
    else {
        throw Error('the easyCalc Version should be ', easyCalcVersion, ' but ', dataArray[0], ' was given');
    }

}

export { easyCalc, serialiseInput, buildEasyCalcInput, easyCalcVersion };