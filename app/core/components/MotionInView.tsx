"use client";

import React, { forwardRef, memo } from "react";
import { motion, MotionProps } from "framer-motion";

// دمج الأنواع لتجنب أي تعارض في الـ TypeScript
type MotionInViewProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, keyof MotionProps>;

const MotionInView = forwardRef<HTMLDivElement, MotionInViewProps>(
  (
    {
      children,
      variants,
      className,
      threshold = 0.1,
      triggerOnce = true,
      ...rest
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        // هامش الرؤية لبدء الحركة بشكل طبيعي قبل الظهور الكامل
        viewport={{ once: triggerOnce, amount: threshold, margin: "0px 0px -50px 0px" }}
        variants={variants}
        // تفعيل تسريع الأجهزة (GPU) عن طريق إخبار المتصفح بالتغييرات المتوقعة
        style={{ willChange: "transform, opacity", ...rest.style }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);

MotionInView.displayName = "MotionInView";

export default memo(MotionInView);