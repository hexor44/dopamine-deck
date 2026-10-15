import { AnimatePresence, motion } from 'framer-motion'

export default function Praise({ text }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          key={text}
          className="pointer-events-none fixed inset-x-0 top-1/3 z-50 flex justify-center px-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              className="absolute h-32 w-32 rounded-full bg-sage/20"
              initial={{ scale: 0.4, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 2.2, ease: 'easeOut' }}
            />
            <p className="relative rounded-3xl bg-surface/95 px-6 py-4 text-center font-serif text-xl shadow-lg ring-1 ring-mist">
              {text}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
