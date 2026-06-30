import DriverTrip from "@/models/DriverTrip";
import Bus from "@/models/Bus";
import connectDB from "@/lib/db";

export const createTrip = async (data, driverId) => {
    await connectDB();

    // بررسی وجود Bus و هماهنگی راننده
    const bus = await Bus.findOne({ _id: data.bus_id, driver_id: driverId });
    if (!bus) throw new Error("اتوبوس معتبر نیست یا متعلق به این راننده نیست");


    // اگر فیلدها خالی وارد شدند، از Bus کپی کنیم
    const trip = await DriverTrip.create({
        ...data,
        driver_id: driverId,
        capacity: parseInt(bus.capacity),
        images: bus.images || []
    });

    return trip;
};

export const getAllTrips = async () => {
    await connectDB();
    return DriverTrip.find().sort({ createdAt: -1 });
};

export const getTripById = async (id) => {
    await connectDB();
    return DriverTrip.findById(id);
};

export const updateTrip = async (id, data, userId) => {
    await connectDB();
    const trip = await DriverTrip.findOne({ _id: id, driver_id: userId });
    if (!trip) throw new Error("سفر پیدا نشد یا دسترسی ندارید");

    Object.assign(trip, data);
    await trip.save();

    return trip;
};

export const deleteTrip = async (id, userId) => {
    await connectDB();
    const deleted = await DriverTrip.findOneAndDelete({ _id: id, driver_id: userId });
    if (!deleted) throw new Error("سفر حذف نشد یا دسترسی ندارید");
    return deleted;
};

export const getMyTrips = async (driverId) => {
    await connectDB();
    return DriverTrip.find({ driver_id: driverId }).sort({ movingDate: 1 });
};

export const searchTrips = async (query) => {
    await connectDB();

    const { origin, destination, date } = query;

    const filter = {};

    if (origin) filter.origin = new RegExp(origin, "i");
    if (destination) filter.destination = new RegExp(destination, "i");
    if (date) {
        filter.movingDate = {
            $gte: new Date(date),
            $lte: new Date(date + "T23:59:59")
        };
    }

    return DriverTrip.find(filter).sort({ movingDate: 1, moving_hour: 1 });
};
