const round = (num) => Math.round(num * 100) / 100

class PowerSource {
    constructor(capacity) {
        this.capacity = capacity
    }

    getPower(isDaytime) {
        return this.capacity
    }
}

class PowerPlant extends PowerSource {
    constructor(capacity) {
        super(capacity)
    }
}

class SolarPanel extends PowerSource {
    constructor(capacity) {
        super(capacity)
    }

    getPower(isDaytime) {
        return isDaytime ? this.capacity : 0
    }
}

class ResidentialBuilding {
    constructor(apartments) {
        this.apartments = apartments
    }

    getConsumption(isDaytime) {
        return (this.apartments * (isDaytime ? 4 : 1)) / 1000
    }
}

class TransmissionLine {
    constructor(capacity, pricePerMw) {
        this.capacity = capacity
        this.pricePerMw = pricePerMw
    }
}

class ElectricityGrid {
    constructor() {
        this.powerSources = []
        this.buildings = []
        this.transmissionLines = []
    }

    addPowerSource(powerSource) {
        this.powerSources.push(powerSource)
    }

    addBuilding(building) {
        this.buildings.push(building)
    }

    addTransmissionLine(line) {
        this.transmissionLines.push(line)
    }

    calculateBalance(isDaytime) {
        const totalGeneration = this.powerSources.reduce((sum, source) => sum + source.getPower(isDaytime), 0)
        const totalConsumption = this.buildings.reduce((sum, building) => sum + building.getConsumption(isDaytime), 0)
        return round(totalGeneration - totalConsumption)
    }

    calculateConsumption(isDaytime) {
        return round(this.buildings.reduce((sum, building) => sum + building.getConsumption(isDaytime), 0))
    }

    calculateCost(isDaytime) {
        let balance = this.calculateBalance(isDaytime)
        let cost = 0
        if (balance !== 0) {
            let powerToHandle = Math.abs(balance)
            const sortedLines = balance < 0
                ? this.transmissionLines.sort((a, b) => a.pricePerMw - b.pricePerMw)
                : this.transmissionLines.sort((a, b) => b.pricePerMw - a.pricePerMw)
            for (const line of sortedLines) {
                const powerToProcess = Math.min(powerToHandle, line.capacity)
                cost += powerToProcess * line.pricePerMw
                powerToHandle -= powerToProcess
                if (powerToHandle === 0) {
                    break
                }
            }
        }
        return round(cost)
    }

    calculateDayAndNight() {
        const dayBalance = this.calculateBalance(true)
        const dayCost = this.calculateCost(true)
        const nightBalance = this.calculateBalance(false)
        const nightCost = this.calculateCost(false)
        const dayConsumption = this.calculateConsumption(true)
        const nightConsumption = this.calculateConsumption(false)
        return {
            day: { balance: dayBalance, cost: dayCost, consumption: dayConsumption },
            night: { balance: nightBalance, cost: nightCost, consumption: nightConsumption }
        }
    }

    calculate() {
        const result = this.calculateDayAndNight()
        const maxTransmissionCapacity = this.transmissionLines.reduce((sum, line) => sum + line.capacity, 0)
        console.log(`Денний баланс: ${result.day.balance} МВт \n- Споживання вдень: ${result.day.consumption} МВт \n${
            result.day.balance < 0 ?
                `- Необхідно закупити ${Math.abs(result.day.balance)} МВт, Вартість: ${result.day.cost} грн` :
                `- Можна продати ${Math.min(result.day.balance, maxTransmissionCapacity)} МВт, Прибуток: ${result.day.cost} грн`}`)
        
        console.log(`Нічний баланс: ${result.night.balance} МВт \n- Споживання вночі: ${result.night.consumption} МВт \n${
            result.night.balance < 0 ?
                `- Необхідно закупити ${Math.abs(result.night.balance)} МВт, Вартість: ${result.night.cost} грн` :
                `- Можна продати ${Math.min(result.night.balance, maxTransmissionCapacity)} МВт, Прибуток: ${result.night.cost} грн`}`)
    }
}

(() => {
    const grid = new ElectricityGrid()

    grid.addPowerSource(new PowerPlant(20))
    grid.addPowerSource(new PowerPlant(25))
    
    grid.addPowerSource(new SolarPanel(5))
    grid.addPowerSource(new SolarPanel(5))
    grid.addPowerSource(new SolarPanel(5))
    grid.addPowerSource(new SolarPanel(5))
    grid.addPowerSource(new SolarPanel(5))
    grid.addPowerSource(new SolarPanel(5))
    grid.addPowerSource(new SolarPanel(5))
    grid.addPowerSource(new SolarPanel(5))
    
    grid.addBuilding(new ResidentialBuilding(8))
    grid.addBuilding(new ResidentialBuilding(8))
    grid.addBuilding(new ResidentialBuilding(8))
    grid.addBuilding(new ResidentialBuilding(16))
    grid.addBuilding(new ResidentialBuilding(16))
    grid.addBuilding(new ResidentialBuilding(16))
    grid.addBuilding(new ResidentialBuilding(16))
    grid.addBuilding(new ResidentialBuilding(16))
    grid.addBuilding(new ResidentialBuilding(32))
    grid.addBuilding(new ResidentialBuilding(32))
    grid.addBuilding(new ResidentialBuilding(32))
    grid.addBuilding(new ResidentialBuilding(32))
    grid.addBuilding(new ResidentialBuilding(64))
    grid.addBuilding(new ResidentialBuilding(64))
    grid.addBuilding(new ResidentialBuilding(64))
    grid.addBuilding(new ResidentialBuilding(64))
    grid.addBuilding(new ResidentialBuilding(64))
    grid.addBuilding(new ResidentialBuilding(64))
    grid.addBuilding(new ResidentialBuilding(128))
    grid.addBuilding(new ResidentialBuilding(256))
    grid.addBuilding(new ResidentialBuilding(400))
    grid.addBuilding(new ResidentialBuilding(400))
    grid.addBuilding(new ResidentialBuilding(400))
    grid.addBuilding(new ResidentialBuilding(400))
    grid.addBuilding(new ResidentialBuilding(400))
    grid.addBuilding(new ResidentialBuilding(400))
    
    grid.addTransmissionLine(new TransmissionLine(20, 7500))
    grid.addTransmissionLine(new TransmissionLine(25, 7200))
    
    grid.calculate()
    
})()
