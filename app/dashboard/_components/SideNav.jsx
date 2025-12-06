"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { GraduationCap, Hand, LayoutIcon, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

function SideNav() {
  const { user } = useKindeBrowserClient();

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutIcon, path: "/dashboard" },
    {
      id: 2,
      name: "Students",
      icon: GraduationCap,
      path: "/dashboard/students",
    },
    { id: 3, name: "Attendance", icon: Hand, path: "/dashboard/attendance" },
    { id: 4, name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, []);

  return (
    <div className="border shadow-md h-screen p-5">
      <div className="mb-8">
        <Image src="/logo.svg" width={70} height={30} alt="Logo" />
      </div>

      <hr className="my-5" />

      <div className="space-y-2">
        {menuList.map((menu) => (
          <Link key={menu.id} href={menu?.path}>
            <div
              key={menu.id}
              className={` ${
                path == menu.path && "bg-blue-600 text-white"
              } flex items-center gap-3 p-4 text-slate-500 hover:bg-primary hover:text-white cursor-pointer rounded-lg transition-all`}
            >
              <menu.icon className="w-5 h-5" />
              <span>{menu.name}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* User Profile Section */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        {user?.picture ? (
          <Image
            src={user.picture}
            width={40}
            height={40}
            alt="User profile"
            className="rounded-full border-2 border-white shadow"
          />
        ) : (
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {(user?.given_name?.[0] || "U").toUpperCase()}
          </div>
        )}

        <div className="overflow-hidden">
          <h2 className="text-sm font-semibold truncate">
            {user?.given_name} {user?.family_name}
          </h2>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
