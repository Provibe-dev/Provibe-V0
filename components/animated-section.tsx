import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ 
  children, 
  id, 
  className, 
  delay = 0 
}: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      className={cn("", className)} // Remove any default padding/margin here
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.section>
  );
}
