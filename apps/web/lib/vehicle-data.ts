export const VEHICLE_MAKES = [
    {
        make: "Toyota",
        models: ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "Prius", "4Runner"]
    },
    {
        make: "Honda",
        models: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "HR-V", "Ridgeline"]
    },
    {
        make: "Ford",
        models: ["F-150", "Escape", "Explorer", "Mustang", "Edge", "Bronco", "Ranger"]
    },
    {
        make: "Chevrolet",
        models: ["Silverado", "Equinox", "Malibu", "Tahoe", "Suburban", "Traverse", "Colorado"]
    },
    {
        make: "Nissan",
        models: ["Altima", "Rogue", "Sentra", "Pathfinder", "Frontier", "Murano"]
    },
    {
        make: "Hyundai",
        models: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade", "Kona"]
    },
    {
        make: "Kia",
        models: ["Forte", "Optima", "Sportage", "Sorento", "Telluride", "Soul"]
    },
    {
        make: "Subaru",
        models: ["Outback", "Forester", "Crosstrek", "Impreza", "Ascent"]
    },
    {
        make: "Volkswagen",
        models: ["Jetta", "Passat", "Tiguan", "Atlas", "Golf"]
    },
    {
        make: "BMW",
        models: ["3 Series", "5 Series", "X3", "X5", "X7"]
    },
    {
        make: "Mercedes-Benz",
        models: ["C-Class", "E-Class", "GLC", "GLE", "S-Class"]
    },
    {
        make: "Audi",
        models: ["A4", "A6", "Q5", "Q7", "Q3"]
    },
    {
        make: "Lexus",
        models: ["RX", "ES", "NX", "GX", "IS"]
    },
    {
        make: "Tesla",
        models: ["Model 3", "Model Y", "Model S", "Model X"]
    }
].sort((a, b) => a.make.localeCompare(b.make));
