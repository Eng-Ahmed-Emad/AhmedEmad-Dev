"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";

type MotionInViewProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const MotionInView: React.FC<MotionInViewProps> = ({
  children,
  variants,
  className,
  threshold = 0.1,
  triggerOnce = true,
  ...rest
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: triggerOnce, amount: threshold }}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default MotionInView;