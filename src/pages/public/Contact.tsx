import { useState } from 'react';
import { Button, Input } from '../../components/ui';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container-custom py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="section-title text-center font-display">Contact Us</h1>
        <p className="section-subtitle text-center">Have a question? We'd love to hear from you.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-primary font-display mb-2">Email</h3>
              <p className="text-neutral-700">info@rentalisting.com</p>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-primary font-display mb-2">Phone</h3>
              <p className="text-neutral-700">+1 (555) 123-4567</p>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-primary font-display mb-2">Address</h3>
              <p className="text-neutral-700">123 Main Street, New York, NY 10001</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-1.5">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                className="input-field resize-none"
              />
            </div>
            <Button type="submit" loading={loading} className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
