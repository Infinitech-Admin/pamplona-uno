"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Home,
  Landmark,
  X,
  ZoomIn,
  CheckCircle2,
  MapPin,
  Phone,
  HeartHandshake,
  FileText,
  Scale,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| BARANGAY DATA (edit here to keep the page up to date)
|--------------------------------------------------------------------------
| Sources: PSA 2024 POPCEN and 2015 census, PSGC, BetterLasPinas.org
| barangay directory, Waze listing for the barangay hall.
| Officials reflect the 2023-2026 term; confirm after any barangay election.
*/
const BRGY = {
  hallAddress: "Alabang-Zapote Road corner Trinidad, Las Piñas City 1740",
  phone: "(02) 8871-2771",
  population2024: "19,658",
  households2015: "4,391",
  termLabel: "2023–2026 term",
};

// Optional: put a real photo of your officials in /public and set the path
// below, for example "/barangay-officials.jpg". Leave empty to hide the photo.
const TEAM_IMAGE = "";

const officials = [
  { role: "Punong Barangay", name: "Hon. Reinier S. Salvador" },
  { role: "Barangay Secretary", name: "Romeo F. Soriano Jr." },
  { role: "Barangay Treasurer", name: "Jose C. Miranda" },
  { role: "SK Chairperson", name: "Hannah Joy M. Magdales" },
];

export default function AboutSection() {
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);

  const stats = [
    {
      icon: Users,
      number: BRGY.population2024,
      label: "Residents (2024 Census)",
    },
    {
      icon: Home,
      number: BRGY.households2015,
      label: "Households (2015 Census)",
    },
    {
      icon: MapPin,
      number: "3",
      label: "Neighboring Barangays",
    },
    {
      icon: Landmark,
      number: "20",
      label: "Barangays in Las Piñas City",
    },
  ];

  const highlights = [
    "Barangay clearances, IDs, and certificates of residency issued at the barangay hall",
    "Mediation of community disputes through the Katarungang Pambarangay system",
    "Blotter and incident reporting assistance for residents",
    "Referrals and certificates that help residents access health and social assistance",
  ];

  const services = [
    {
      icon: FileText,
      title: "Clearances & Certificates",
      description:
        "Barangay clearance, certificate of residency, indigency, and good moral character for your everyday transactions.",
    },
    {
      icon: Scale,
      title: "Mediation & Blotter",
      description:
        "Report incidents and settle neighborhood disputes through the barangay justice process.",
    },
    {
      icon: HeartHandshake,
      title: "Community Assistance",
      description:
        "Help and referrals for senior citizens, persons with disabilities, and families who need support.",
    },
  ];

  const pillClass =
    "inline-block px-5 py-2 rounded-full bg-brand-primary-100 text-brand-primary-700 text-sm font-bold";

  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-50 via-white to-brand-accent-50" />

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-brand-primary-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-brand-secondary-300/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-5"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.12,
                    duration: 0.5,
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                  }}
                  className="p-7 rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-brand-primary-200 text-center group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>

                  <div className="text-sm font-semibold text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="col-span-2 p-6 rounded-3xl bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 text-white shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-white/75 font-medium">
                    Barangay Hall
                  </p>

                  <h4 className="text-xl font-bold">Barangay Pamplona Uno</h4>

                  <p className="text-sm text-white/85 mt-1">
                    {BRGY.hallAddress}
                  </p>

                  <p className="text-sm text-white/85 mt-1 flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    {BRGY.phone}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-5"
            >
              <span className={pillClass}>About Our Community</span>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent">
                Barangay Pamplona Uno
              </span>
            </h2>

            <div className="w-24 h-1.5 bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 rounded-full mb-7" />

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Barangay Pamplona Uno is one of the 20 barangays of Las Piñas
              City, Metro Manila. It shares borders with Pamplona Tres, Pamplona
              Dos, and Zapote, and its population has grown from 17,415 in 2000
              to {BRGY.population2024} residents in the 2024 census.
            </p>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              The barangay hall is the first stop for residents who need
              clearances, certificates, incident reports, or help settling
              community concerns, and this website lets residents learn about
              and request these services in one place.
            </p>

            {/* Highlights */}
            <div className="space-y-4">
              {highlights.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.5,
                  }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-7 h-7 text-brand-primary-600 group-hover:scale-110 transition-transform" />
                  </div>

                  <span className="text-gray-800 text-base sm:text-lg font-medium leading-relaxed">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-9"
            >
              <a
                href="#officials"
                className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 text-white font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                Meet Our Officials
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <span className={`${pillClass} mb-5`}>How We Help</span>

            <h3 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent">
                Serving Our Community
              </span>
            </h3>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Everyday barangay services for the families, workers, and
              businesses of Pamplona Uno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.12,
                    duration: 0.5,
                  }}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl border border-gray-100 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h4>

                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Officials */}
        <motion.div
          id="officials"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-28 scroll-mt-24"
        >
          <div className="text-center mb-12">
            <span className={`${pillClass} mb-5`}>Our Community Leaders</span>

            <h3 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-brand-primary-600 via-brand-secondary-600 to-brand-accent-600 bg-clip-text text-transparent">
                Barangay Officials
              </span>
            </h3>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Elected and appointed officials serving Barangay Pamplona Uno (
              {BRGY.termLabel}).
            </p>
          </div>

          {/* Optional team photo */}
          {TEAM_IMAGE && (
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer mb-8"
              onClick={() => setIsImageModalOpen(true)}
            >
              <div className="aspect-[21/9] relative bg-gray-100">
                <img
                  src={TEAM_IMAGE}
                  alt="Barangay Pamplona Uno officials"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                    <ZoomIn className="w-8 h-8 text-gray-800" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <h4 className="text-2xl md:text-3xl font-bold text-white">
                    Barangay Pamplona Uno Officials
                  </h4>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {officials.map((official, i) => (
              <motion.div
                key={official.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-7 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>

                <div className="text-sm font-semibold text-brand-primary-700 mb-1">
                  {official.role}
                </div>

                <div className="text-lg font-bold text-gray-900">
                  {official.name}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            The Sangguniang Barangay also has seven elected members (kagawads)
            who work with the Punong Barangay.
          </p>
        </motion.div>
      </div>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {TEAM_IMAGE && isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            <button
              type="button"
              aria-label="Close image"
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all group z-50"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={TEAM_IMAGE}
                alt="Barangay Pamplona Uno officials - full view"
                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />

              <div className="mt-6 text-center">
                <h4 className="text-2xl md:text-3xl font-bold text-white">
                  Barangay Pamplona Uno Officials
                </h4>
              </div>
            </motion.div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              Click anywhere outside the image to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
