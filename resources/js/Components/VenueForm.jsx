import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { facilityIcon } from '@/lib/facilities';
import { imageForVenue } from '@/lib/utils';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Check, ImagePlus, Info, LoaderCircle, UploadCloud, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const MAX_IMAGES = 5;

export default function VenueForm({ venue = null }) {
    const { venueFacilities = {} } = usePage().props;
    const isEdit = Boolean(venue);
    const [existingImages, setExistingImages] = useState(venue?.images ?? []);
    const [newPreviews, setNewPreviews] = useState([]);
    const [fileNotice, setFileNotice] = useState(null);
    const objectUrls = useRef(new Set());

    const form = useForm({
        name: venue?.name ?? '',
        city: venue?.city ?? '',
        address: venue?.address ?? '',
        description: venue?.description ?? '',
        phone: venue?.phone ?? '',
        images: [],
        removed_images: [],
        facilities: venue?.facilities ?? [],
    });

    useEffect(() => {
        return () => {
            objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
            objectUrls.current.clear();
        };
    }, []);

    const handleFiles = (files) => {
        const remainingSlots = Math.max(
            MAX_IMAGES - existingImages.length - form.data.images.length,
            0,
        );

        if (remainingSlots === 0) {
            setFileNotice(`Maksimal ${MAX_IMAGES} foto sudah terpenuhi.`);

            return;
        }

        const existingKeys = new Set(
            form.data.images.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
        );
        const selected = [];
        let skipped = 0;

        for (const file of Array.from(files)) {
            const key = `${file.name}-${file.size}-${file.lastModified}`;

            if (existingKeys.has(key)) {
                continue;
            }

            if (selected.length >= remainingSlots) {
                skipped++;

                continue;
            }

            existingKeys.add(key);
            selected.push(file);
        }

        if (selected.length === 0) {
            setFileNotice(
                skipped > 0
                    ? `Maksimal ${MAX_IMAGES} foto. ${skipped} foto tidak ditambahkan.`
                    : 'Foto tersebut sudah dipilih.',
            );

            return;
        }

        const previews = selected.map((file) => {
            const url = URL.createObjectURL(file);
            objectUrls.current.add(url);

            return { file, url, name: file.name };
        });

        form.setData('images', [...form.data.images, ...selected]);
        setNewPreviews((current) => [...current, ...previews]);
        setFileNotice(
            skipped > 0
                ? `${selected.length} foto ditambahkan. ${skipped} foto tidak ditambahkan karena batas ${MAX_IMAGES} foto.`
                : null,
        );
    };

    const removeExisting = (image) => {
        setExistingImages((current) => current.filter((item) => item !== image));
        form.setData('removed_images', [...form.data.removed_images, image]);
        setFileNotice(null);
    };

    const removeNew = (index) => {
        const preview = newPreviews[index];

        if (preview) {
            URL.revokeObjectURL(preview.url);
            objectUrls.current.delete(preview.url);
        }

        setNewPreviews((current) => current.filter((_, previewIndex) => previewIndex !== index));
        form.setData(
            'images',
            form.data.images.filter((_, fileIndex) => fileIndex !== index),
        );
        setFileNotice(null);
    };

    const toggleFacility = (value) => {
        const selected = form.data.facilities.includes(value);

        form.setData(
            'facilities',
            selected
                ? form.data.facilities.filter((facility) => facility !== value)
                : [...form.data.facilities, value],
        );
    };

    const submit = (event) => {
        event.preventDefault();

        if (isEdit) {
            form.put(route('owner.venues.update', venue.id), { forceFormData: true });
        } else {
            form.post(route('owner.venues.store'), { forceFormData: true });
        }
    };

    return (
        <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <div className="space-y-5">
                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="text-base font-bold text-slate-900">Informasi venue</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Data ini akan tampil di halaman pencarian dan detail venue.
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="name" value="Nama venue" />
                            <input
                                id="name"
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                placeholder="Contoh: Sportify Arena Kemang"
                                className="mt-1.5 w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                            />
                            <InputError message={form.errors.name} className="mt-1.5" />
                        </div>

                        <div>
                            <InputLabel htmlFor="city" value="Kota" />
                            <input
                                id="city"
                                value={form.data.city}
                                onChange={(event) => form.setData('city', event.target.value)}
                                placeholder="Jakarta Selatan"
                                className="mt-1.5 w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                            />
                            <InputError message={form.errors.city} className="mt-1.5" />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="Nomor telepon" />
                            <input
                                id="phone"
                                value={form.data.phone}
                                onChange={(event) => form.setData('phone', event.target.value)}
                                placeholder="0812xxxxxxx"
                                className="mt-1.5 w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                            />
                            <InputError message={form.errors.phone} className="mt-1.5" />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="address" value="Alamat lengkap" />
                            <textarea
                                id="address"
                                value={form.data.address}
                                onChange={(event) => form.setData('address', event.target.value)}
                                rows={2}
                                placeholder="Nama jalan, nomor, kelurahan, kecamatan"
                                className="mt-1.5 w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                            />
                            <InputError message={form.errors.address} className="mt-1.5" />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="description" value="Deskripsi venue" />
                            <textarea
                                id="description"
                                value={form.data.description}
                                onChange={(event) => form.setData('description', event.target.value)}
                                rows={4}
                                placeholder="Ceritakan fasilitas, keunggulan, dan suasana venue..."
                                className="mt-1.5 w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                            />
                            <InputError message={form.errors.description} className="mt-1.5" />
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="text-base font-bold text-slate-900">Fasilitas venue</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Pilih fasilitas yang benar-benar tersedia agar customer tidak kecewa saat
                        datang.
                    </p>

                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                        {Object.entries(venueFacilities).map(([value, label]) => {
                            const Icon = facilityIcon(value);
                            const selected = form.data.facilities.includes(value);

                            return (
                                <label
                                    key={value}
                                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-medium transition ${
                                        selected
                                            ? 'border-brand-600 bg-brand-50 text-brand-800 ring-1 ring-brand-600'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() => toggleFacility(value)}
                                        className="sr-only"
                                    />
                                    <Icon
                                        className={`h-4 w-4 shrink-0 ${
                                            selected ? 'text-brand-600' : 'text-slate-400'
                                        }`}
                                    />
                                    <span className="flex-1">{label}</span>
                                    {selected && <Check className="h-4 w-4 text-brand-600" />}
                                </label>
                            );
                        })}
                    </div>

                    <InputError message={form.errors.facilities} className="mt-1.5" />
                </section>

                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Foto venue</h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Maksimal {MAX_IMAGES} foto. Format JPG, PNG, atau WEBP (maks. 4 MB
                                per foto).
                            </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                            {existingImages.length + newPreviews.length}/{MAX_IMAGES}
                        </span>
                    </div>

                    {(existingImages.length > 0 || newPreviews.length > 0) && (
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {existingImages.map((image) => (
                                <div
                                    key={image}
                                    className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200"
                                >
                                    <img
                                        src={image}
                                        alt="Foto venue"
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExisting(image)}
                                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-lg bg-slate-950/70 text-white backdrop-blur transition hover:bg-rose-600"
                                        aria-label="Hapus foto"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}

                            {newPreviews.map((preview, index) => (
                                <div
                                    key={preview.url}
                                    className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-brand-300"
                                >
                                    <img
                                        src={preview.url}
                                        alt={preview.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <span className="absolute bottom-2 left-2 rounded-md bg-brand-600/90 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                                        Baru
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeNew(index)}
                                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-lg bg-slate-950/70 text-white backdrop-blur transition hover:bg-rose-600"
                                        aria-label="Hapus foto"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {existingImages.length + newPreviews.length < MAX_IMAGES && (
                        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 text-center transition hover:border-brand-400 hover:bg-brand-50/40">
                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">
                                <UploadCloud className="h-5 w-5" />
                            </span>
                            <span className="mt-3 text-sm font-semibold text-slate-700">
                                Klik untuk memilih foto
                            </span>
                            <span className="mt-1 text-xs text-slate-400">
                                Bisa pilih beberapa foto sekaligus, atau tambah lagi nanti
                            </span>
                            <input
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(event) => {
                                    handleFiles(event.target.files);
                                    event.target.value = '';
                                }}
                                className="sr-only"
                            />
                        </label>
                    )}

                    {fileNotice && (
                        <p className="mt-2 text-xs font-medium text-amber-700">{fileNotice}</p>
                    )}

                    {Object.entries(form.errors)
                        .filter(([key]) => key === 'images' || key.startsWith('images.'))
                        .map(([key, message]) => (
                            <p key={key} className="mt-2 text-sm font-medium text-rose-600">
                                {message}
                            </p>
                        ))}
                </section>
            </div>

            <div className="space-y-4">
                <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900">Tips tampilan venue</h3>
                    <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-slate-500">
                        {[
                            'Gunakan foto lapangan dengan pencahayaan terang.',
                            'Tulis fasilitas unggulan seperti parkir, shower, atau kantin.',
                            'Pastikan nomor telepon aktif untuk dihubungi customer.',
                        ].map((tip) => (
                            <li key={tip} className="flex gap-2">
                                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </section>

                {isEdit && (
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <img
                            src={imageForVenue({ ...venue, images: existingImages })}
                            alt={venue.name}
                            className="aspect-[16/9] w-full object-cover"
                        />
                        <div className="p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Pratinjau
                            </p>
                            <p className="mt-1 text-sm font-bold text-slate-900">
                                {form.data.name || venue.name}
                            </p>
                            <p className="text-xs text-slate-500">{form.data.city || venue.city}</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {form.processing ? (
                            <>
                                <LoaderCircle className="h-4 w-4 animate-spin" /> Menyimpan...
                            </>
                        ) : isEdit ? (
                            'Simpan Perubahan'
                        ) : (
                            'Buat Venue'
                        )}
                    </button>
                    <Link
                        href={route('owner.venues.index')}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        Batal
                    </Link>
                    {isEdit && (
                        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                            <ImagePlus className="h-3.5 w-3.5" />
                            Perubahan foto langsung terlihat setelah disimpan.
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
}
